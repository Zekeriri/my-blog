<#
.SYNOPSIS
  只加密/解密 Markdown 正文；frontmatter（--- 之间）保持明文。

.EXAMPLE
  .\scripts\post-crypto.ps1 encrypt "src\content\blog\个人记录\某篇.md"
  .\scripts\post-crypto.ps1 decrypt "src\content\blog\个人记录\某篇.md"
  .\scripts\post-crypto.ps1 "src\content\blog\个人记录\某篇.md"   # 自动切换
#>
param(
  [Parameter(Position = 0)]
  [string]$ActionOrPath,

  [Parameter(Position = 1)]
  [string]$Path
)

$ErrorActionPreference = "Stop"
$Marker = "<!-- encrypted:age -->"

function Show-Usage {
  Write-Host @"
用法:
  .\scripts\post-crypto.ps1 encrypt <文章.md>
  .\scripts\post-crypto.ps1 decrypt <文章.md>
  .\scripts\post-crypto.ps1 <文章.md>          # 已加密则解密，否则加密

说明:
  只处理正文。开头 --- ... --- 的 frontmatter 不会加密。
"@
}

function Resolve-Age {
  $cmd = Get-Command age -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }

  $hit = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Filter age.exe -Recurse -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($hit) { return $hit.FullName }

  $link = Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Links\age.exe"
  if (Test-Path -LiteralPath $link) { return $link }

  throw "未找到 age。请先执行: winget install --id FiloSottile.age -e"
}

function Split-Markdown([string]$raw) {
  if ($raw -match '(?s)\A---\r?\n(.*?)\r?\n---\r?\n?(.*)\z') {
    return @{
      Frontmatter = $Matches[1].TrimEnd()
      Body        = $Matches[2]
    }
  }
  throw "文件缺少 YAML frontmatter（开头的 --- 块）。"
}

function Test-EncryptedBody([string]$body) {
  return [bool]($body -match [regex]::Escape($Marker))
}

function Write-MarkdownFile([string]$full, [string]$frontmatter, [string]$body) {
  $nl = "`n"
  $body = $body.TrimEnd() + $nl
  $out = "---$nl$frontmatter$nl---$nl$nl$body"
  [System.IO.File]::WriteAllText($full, $out, [System.Text.UTF8Encoding]::new($false))
}

function Invoke-Encrypt([string]$full, [string]$age) {
  $raw = Get-Content -LiteralPath $full -Raw -Encoding UTF8
  $parts = Split-Markdown $raw

  if (Test-EncryptedBody $parts.Body) {
    throw "正文已经是密文。要修改请先: .\scripts\post-crypto.ps1 decrypt `"$full`""
  }

  $plain = $parts.Body.Trim()
  if (-not $plain) {
    throw "正文为空，没什么可加密。"
  }

  $tempIn = [System.IO.Path]::GetTempFileName()
  $tempOut = [System.IO.Path]::GetTempFileName()
  try {
    [System.IO.File]::WriteAllText($tempIn, ($plain + "`n"), [System.Text.UTF8Encoding]::new($false))
    Write-Host "加密正文（frontmatter 保持明文）"
    Write-Host "请输入密码（通常不显示），再确认一次："
    & $age -p -a -o $tempOut $tempIn
    if ($LASTEXITCODE -ne 0) { throw "age 加密失败" }

    $cipher = [System.IO.File]::ReadAllText($tempOut).TrimEnd()
    $fence = '```'
    $body = "$Marker`n$fence" + "age`n$cipher`n$fence"
    Write-MarkdownFile $full $parts.Frontmatter $body
    Write-Host "已加密: $full"
  }
  finally {
    Remove-Item -LiteralPath $tempIn, $tempOut -Force -ErrorAction SilentlyContinue
  }
}

function Invoke-Decrypt([string]$full, [string]$age) {
  $raw = Get-Content -LiteralPath $full -Raw -Encoding UTF8
  $parts = Split-Markdown $raw

  if (-not (Test-EncryptedBody $parts.Body)) {
    throw "正文不是密文（缺少 $Marker）。"
  }

  if ($parts.Body -notmatch '(?s)```age\r?\n(.*?)```') {
    throw "未找到 ```age 密文代码块。"
  }

  $cipher = $Matches[1].Trim() + "`n"
  $tempIn = [System.IO.Path]::GetTempFileName()
  $tempOut = [System.IO.Path]::GetTempFileName()
  try {
    [System.IO.File]::WriteAllText($tempIn, $cipher, [System.Text.UTF8Encoding]::new($false))
    Write-Host "解密正文"
    Write-Host "请输入密码："
    & $age -d -o $tempOut $tempIn
    if ($LASTEXITCODE -ne 0) { throw "age 解密失败（密码错误？）" }

    $plain = [System.IO.File]::ReadAllText($tempOut).TrimEnd()
    Write-MarkdownFile $full $parts.Frontmatter $plain
    Write-Host "已解密: $full"
    Write-Host "改完后请再加密再提交。"
  }
  finally {
    Remove-Item -LiteralPath $tempIn, $tempOut -Force -ErrorAction SilentlyContinue
  }
}

# --- 解析参数 ---
if (-not $ActionOrPath) {
  Show-Usage
  exit 1
}

$action = $null
$file = $null
$a = $ActionOrPath.ToLowerInvariant()

if ($a -in @("encrypt", "e", "enc", "加密")) {
  $action = "encrypt"
  $file = $Path
}
elseif ($a -in @("decrypt", "d", "dec", "解密")) {
  $action = "decrypt"
  $file = $Path
}
else {
  $file = $ActionOrPath
  if ($Path) {
    Show-Usage
    throw "参数过多。要么写 encrypt/decrypt + 路径，要么只写路径。"
  }
}

if (-not $file) {
  Show-Usage
  throw "请提供文章 .md 路径。"
}

if (-not (Test-Path -LiteralPath $file)) {
  throw "文件不存在: $file"
}

$full = (Resolve-Path -LiteralPath $file).Path
$age = Resolve-Age

if (-not $action) {
  $raw = Get-Content -LiteralPath $full -Raw -Encoding UTF8
  $parts = Split-Markdown $raw
  $action = if (Test-EncryptedBody $parts.Body) { "decrypt" } else { "encrypt" }
  Write-Host "自动模式: $action"
}

if ($action -eq "encrypt") {
  Invoke-Encrypt $full $age
}
else {
  Invoke-Decrypt $full $age
}
