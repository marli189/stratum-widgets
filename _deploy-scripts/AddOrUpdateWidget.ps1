param(
    [Parameter(Mandatory=$true)] [String]$Environment,
    [Parameter(Mandatory=$true)] [String]$WidgetFileName
)

Import-Module .\Helpers -Force # -Verbose
$ErrorActionPreference = "Stop"
$serverInstance = ""

switch($Environment)
{
    "UTV" { 
        $serverInstance = "RC-UTV\STRATUM" 
    }
    "DEMO" { 
        $serverInstance = "RC-DB\DEMO" 
    }
    "PROD" { 
        $serverInstance = "RC-DB\PROD" 
    }
    default { $serverInstance = $null }
}

if($null -eq $serverInstance) {
    Write-Error -Message "Unknown or unsupported environment: $Environment." -ErrorAction Stop
}

SetEnvironment -Environment $Environment -ServerInstance $serverInstance

$ScriptFilePath = "$(Get-Location)\$WidgetFileName"
$ScriptBasePath = Split-Path -Path $ScriptFilePath

if (-Not (Test-Path -Path $ScriptFilePath)) {
    Write-Error "Widget file does not exist. $($ScriptFilePath)" -ErrorAction Stop
}

$pageContent = [IO.File]::ReadAllText($ScriptFilePath)

$baseFileName = [System.IO.Path]::GetFileNameWithoutExtension($ScriptFilePath)
$configFileName = $baseFileName + ".config.json"
$fullConfigPath = Join-Path -Path $ScriptBasePath -ChildPath $configFileName

if (-Not (Test-Path -Path $fullConfigPath)) {
    Write-Error "Script config file does not exist. $($fullConfigPath)" -ErrorAction Stop
}

$config = Get-Content $fullConfigPath | ConvertFrom-Json

if (-Not $config.widgetName) {
    Write-Error "Widget name was not specified in config file." -ErrorAction Stop
}

if (-Not $config.widgetId) {
    Write-Error "Widget ID was not specified in config file." -ErrorAction Stop
}

# OLD WAY OF GETTING META DATA OF SCRIPT
# if($pageContent -match "// SiteId: (\d+)") {
#     $SiteId = $Matches[1]
# }
# else {
#     Write-Error "Widget script did not contain SiteId."
#     Exit-PSSession
# }
# if($pageContent -match "// WidgetId: ([a-zA-Z0-9]+/[a-zA-Z0-9]+)") {
#     $WidgetId = $Matches[1]
# }
# else {
#     Write-Error "Widget script did not contain WidgetId."
#     Exit-PSSession
# }
# if($pageContent -match "// WidgetName: ([a-zA-Z0-9 ]+)") {
#     $WidgetName = $Matches[1]
# }
# else {
#     Write-Error "Widget script did not contain WidgetName."
#     Exit-PSSession
# }

$pageId = GetWidgetPageId -WidgetId $config.widgetId
$newPageContent = "<!-- Widget: $($config.widgetId) -->
<script type=""text/javascript"">
$($pageContent)
//# sourceURL=$($config.widgetId)
</script>"

if($pageId) {
    UpdateWidget -WidgetId $config.widgetId -WidgetName $config.widgetName -PageContent $newPageContent -PageId $pageId
}
else {
    CreateWidget -PageContent $newPageContent -WidgetName $config.widgetName -SiteId $SiteId
}