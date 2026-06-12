$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$output = "markdownFiles.json"

# -----------------------------
# Load existing JSON
# -----------------------------
$existing = @{}
$existingFolderTitles = @{}

if (Test-Path $output) {
    try {
        $json = Get-Content $output -Raw | ConvertFrom-Json

        foreach ($topKey in $json.PSObject.Properties.Name) {

            # store folder title if exists
            if ($json.$topKey.title) {
                $existingFolderTitles[$topKey] = $json.$topKey.title
            }

            foreach ($subKey in $json.$topKey.PSObject.Properties.Name) {

                if ($subKey -eq "title") { continue }

                foreach ($entry in $json.$topKey.$subKey.items) {
                    $existing[$entry.filepath] = $entry
                }
            }
        }
    }
    catch {
        Write-Host "Starting fresh (invalid or missing JSON)."
    }
}

# -----------------------------
# Build tree
# -----------------------------
$tree = @{}

Get-ChildItem -Recurse -Filter *.md | ForEach-Object {

    $file = $_

    $relativePath = $file.FullName.Substring($PSScriptRoot.Length + 1)
    $relativePath = $relativePath -replace '\\','/'

    $imagePath = $relativePath -replace '\.md$','.png'
	$audioPath = $relativePath -replace '\.md$','.wav'

    $title = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $date = $file.CreationTime.ToString("MM/dd/yyyy")

    $parts = $relativePath -split '/'

    $top = if ($parts.Count -ge 2) { $parts[0] } else { "root" }
    $sub = if ($parts.Count -ge 3) { $parts[1] } else { "root" }

    # init top folder
    if (-not $tree.ContainsKey($top)) {
        $tree[$top] = @{
            title = if ($existingFolderTitles.ContainsKey($top)) { $existingFolderTitles[$top] } else { $top }
        }
    }

    # init subfolder
    if (-not $tree[$top].ContainsKey($sub)) {
        $tree[$top][$sub] = @{
            title = if ($existingFolderTitles.ContainsKey($sub)) { $existingFolderTitles[$sub] } else { $sub }
            items = @()
        }
    }

    if ($existing.ContainsKey($relativePath)) {
        $tree[$top][$sub].items += $existing[$relativePath]
    }
    else {
        $tree[$top][$sub].items += [PSCustomObject]@{
            title     = $title
			date      = $date
			filepath  = $relativePath
            audiopath = $audioPath
            imagepath = $imagePath
			synopsis = ""
            
        }
    }
}

# -----------------------------
# Remove deleted files
# -----------------------------
$existingFiles = @{}

Get-ChildItem -Recurse -Filter *.md | ForEach-Object {
    $p = $_.FullName.Substring($PSScriptRoot.Length + 1) -replace '\\','/'
    $existingFiles[$p] = $true
}

foreach ($topKey in @($tree.Keys)) {
    foreach ($subKey in @($tree[$topKey].Keys)) {

        if ($subKey -eq "title") { continue }

        $tree[$topKey][$subKey].items = $tree[$topKey][$subKey].items | Where-Object {
            $existingFiles.ContainsKey($_.filepath)
        }

        if ($tree[$topKey][$subKey].items.Count -eq 0) {
            $tree[$topKey].Remove($subKey)
        }
    }

    if (($tree[$topKey].Keys | Where-Object { $_ -ne "title" }).Count -eq 0) {
        $tree.Remove($topKey)
    }
}

# -----------------------------
# Output JSON
# -----------------------------
$tree | ConvertTo-Json -Depth 15 | Set-Content $output

Write-Host "Scanned all files. Edit markdownFiles.json directly to change defaults :3"