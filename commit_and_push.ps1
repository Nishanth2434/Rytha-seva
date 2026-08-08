$ErrorActionPreference = "Stop"

# Get untracked files
$files = git ls-files -o --exclude-standard
$filesArray = $files -split "`r`n" | Where-Object { $_ -ne "" }
if ($filesArray.Length -eq 0) {
    $filesArray = $files -split "`n" | Where-Object { $_ -ne "" }
}

git branch -M main
git remote remove origin
git remote add origin https://github.com/Nishanth2434/Rytha-seva.git

# Commit first 24 files individually
for ($i = 0; $i -lt 24; $i++) {
    if ($i -ge $filesArray.Length) {
        break
    }
    $file = $filesArray[$i]
    $file = $file.Replace("\", "/")
    Write-Host "Adding $file"
    git add "`"$file`""
    git commit -m "Add $file"
}

# Commit the rest
git add .
git commit -m "Add remaining project files"

# Push
Write-Host "Pushing to origin..."
git push -u origin main
