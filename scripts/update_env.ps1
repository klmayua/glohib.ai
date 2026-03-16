# Update .env.docker with secure secrets
$projectRoot = "C:\Users\UCHE\my-qwen-project\PROJECTS\GlohibAI"

# Backup existing file
Copy-Item "$projectRoot\.env.docker" "$projectRoot\.env.docker.backup" -Force

# Read secrets
$jwt = [System.IO.File]::ReadAllText("$projectRoot\.jwt_secret.tmp")
$db = [System.IO.File]::ReadAllText("$projectRoot\.db_password.tmp")
$mr = [System.IO.File]::ReadAllText("$projectRoot\.minio_root.tmp")
$mp = [System.IO.File]::ReadAllText("$projectRoot\.minio_pass.tmp")

# Read and replace
$content = [System.IO.File]::ReadAllText("$projectRoot\.env.docker")
$content = $content -replace 'super-secret-change-me.*', $jwt
$content = $content -replace 'POSTGRES_PASSWORD=changeme', "POSTGRES_PASSWORD=$db"
$content = $content -replace 'MINIO_ROOT_USER=minioadmin', "MINIO_ROOT_USER=$mr"
$content = $content -replace 'MINIO_ROOT_PASSWORD=minioadmin', "MINIO_ROOT_PASSWORD=$mp"
$content = $content -replace 'MINIO_ACCESS_KEY=minioadmin', "MINIO_ACCESS_KEY=$mr"
$content = $content -replace 'MINIO_SECRET_KEY=minioadmin', "MINIO_SECRET_KEY=$mp"

# Write updated content
[System.IO.File]::WriteAllText("$projectRoot\.env.docker", $content)

Write-Host ".env.docker updated with secure credentials"
Write-Host "Backup saved to .env.docker.backup"
