# Add resource limits and logging to docker-compose.yml
$projectRoot = "C:\Users\UCHE\my-qwen-project\PROJECTS\GlohibAI"
$composeFile = "$projectRoot\docker-compose.yml"

# Backup
Copy-Item $composeFile "$composeFile.backup" -Force

$content = Get-Content $composeFile -Raw

# Resource limits block
$resourceLimits = @"
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
"@

# Logging block
$logConfig = @"
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
"@

# Services to update (application services only)
$services = @(
    'identity-service',
    'student-service',
    'internship-service',
    'assessment-service',
    'recommendation-service',
    'scoring-service',
    'video-service'
)

foreach ($svc in $services) {
    $pattern = "  $svc:`n"
    if ($content -match [regex]::Escape($pattern)) {
        # Find the service and add deploy + logging after it
        $lines = Get-Content $composeFile
        $newLines = @()
        $inService = $false
        $addedDeploy = $false
        $addedLogging = $false
        $serviceIndent = "    "
        
        for ($i = 0; $i -lt $lines.Count; $i++) {
            $line = $lines[$i]
            $newLines += $line
            
            if ($line -match "^  $svc`:`") {
                $inService = $true
            }
            elseif ($inService -and $line -match "^  \w" -and $line -notmatch "^    ") {
                # Next service started
                $inService = $false
                $addedDeploy = $false
                $addedLogging = $false
            }
            elseif ($inService -and $line -match "^    restart:" -and -not $addedDeploy) {
                # Add resource limits after restart
                $resourceLines = $resourceLimits -split "`n"
                foreach ($rl in $resourceLines) {
                    $newLines += $rl
                }
                $addedDeploy = $true
            }
            elseif ($inService -and $line -match "^    networks:" -and -not $addedLogging) {
                # Add logging before networks
                $logLines = $logConfig -split "`n"
                # Insert before networks
                $newLines.RemoveAt($newLines.Count - 1)
                foreach ($ll in $logLines) {
                    $newLines += $ll
                }
                $newLines += $line
                $addedLogging = $true
            }
        }
        
        $newLines | Set-Content $composeFile
        Write-Host "Updated $svc with resource limits and logging"
    }
}

Write-Host "docker-compose.yml updated"
