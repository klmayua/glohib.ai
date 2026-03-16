# Generate secure secrets for GlohibAI MVP
$projectRoot = "C:\Users\UCHE\my-qwen-project\PROJECTS\GlohibAI"

# Generate JWT secret (32 bytes)
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$jwt = [System.Convert]::ToBase64String($bytes)
[System.IO.File]::WriteAllText("$projectRoot\.jwt_secret.tmp", $jwt)

# Generate DB password (24 bytes)
$bytes = New-Object byte[] 24
$rng.GetBytes($bytes)
$db = [System.Convert]::ToBase64String($bytes)
[System.IO.File]::WriteAllText("$projectRoot\.db_password.tmp", $db)

# Generate MinIO root user (20 bytes)
$bytes = New-Object byte[] 20
$rng.GetBytes($bytes)
$mr = [System.Convert]::ToBase64String($bytes)
[System.IO.File]::WriteAllText("$projectRoot\.minio_root.tmp", $mr)

# Generate MinIO password (20 bytes)
$bytes = New-Object byte[] 20
$rng.GetBytes($bytes)
$mp = [System.Convert]::ToBase64String($bytes)
[System.IO.File]::WriteAllText("$projectRoot\.minio_pass.tmp", $mp)

Write-Host "Secrets generated successfully in $projectRoot"
Write-Host "JWT secret length: $([System.IO.File]::ReadAllText("$projectRoot\.jwt_secret.tmp").Length)"
Write-Host "DB password length: $([System.IO.File]::ReadAllText("$projectRoot\.db_password.tmp").Length)"
Write-Host "MinIO root length: $([System.IO.File]::ReadAllText("$projectRoot\.minio_root.tmp").Length)"
Write-Host "MinIO pass length: $([System.IO.File]::ReadAllText("$projectRoot\.minio_pass.tmp").Length)"
