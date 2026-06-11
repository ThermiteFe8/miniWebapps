$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$output = "markdownFiles.json"

# -----------------------------
# Load existing JSON (optional)
# -----------------------------
$existing = @{}

if (Test-Path $output) {
    try {
        $json = Get-Content $output -Raw | ConvertFrom-Json

        foreach ($topKey in $json.PSObject.Properties.Name) {
            foreach ($subKey in $json.$topKey.PSObject.Properties.Name) {
                foreach ($entry in $json.$topKey.$subKey) {
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
    $fullPath = $file.FullName

    # relative path
    $relativePath = $fullPath.Substring($PSScriptRoot.Length + 1)
    $relativePath = $relativePath -replace '\\','/'

    $imagePath = $relativePath -replace '\.md$','.png'
	$audioPath = $relativePath -replace '\.md$','.wav'

    # file name as title
    $title = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)

    # creation date formatted
    $date = $file.CreationTime.ToString("MM/dd/yyyy")

    # folder split
    $parts = $relativePath -split '/'

    $top = if ($parts.Count -ge 2) { $parts[0] } else { "root" }
    $sub = if ($parts.Count -ge 3) { $parts[1] } else { "root" }

    if (-not $tree.ContainsKey($top)) {
        $tree[$top] = @{}
    }

    if (-not $tree[$top].ContainsKey($sub)) {
        $tree[$top][$sub] = @()
    }

    if ($existing.ContainsKey($relativePath)) {
        # preserve existing metadata (but allow title/date updates if you want)
        $tree[$top][$sub] += $existing[$relativePath]
    }
    else {
        $tree[$top][$sub] += [PSCustomObject]@{
            title     = $title
			date      = $date
			filepath  = $relativePath      
            imagepath = $imagePath
            audiopath = $audioPath
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

        $tree[$topKey][$subKey] = $tree[$topKey][$subKey] | Where-Object {
            $existingFiles.ContainsKey($_.filepath)
        }

        if ($tree[$topKey][$subKey].Count -eq 0) {
            $tree[$topKey].Remove($subKey)
        }
    }

    if ($tree[$topKey].Count -eq 0) {
        $tree.Remove($topKey)
    }
}

# -----------------------------
# Output JSON
# -----------------------------
$tree | ConvertTo-Json -Depth 10 | Set-Content $output

Write-Host "Done scanning files. Open markdownFiles.json if you wanna edit defaults :3"