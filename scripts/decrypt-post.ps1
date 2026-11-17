param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Path
)
& "$PSScriptRoot\post-crypto.ps1" decrypt $Path
