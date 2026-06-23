function Fix-File {
    param([string]$FilePath, [scriptblock]$Replacements)
    $content = Get-Content $FilePath -Raw
    $newContent = & $Replacements $content
    if ($content -ne $newContent) {
        Set-Content -Path $FilePath -Value $newContent -NoNewline
        Write-Host "Fixed $FilePath"
    }
}

Fix-File -FilePath "src/components/Projects.tsx" -Replacements {
    param($c)
    
    # Replace Card Transforms
    $c = $c -replace 'const cardRotateX = useTransform\([\s\S]*?\]\s*\);', 'const cardRotateX = useTransform(relativeProgress, [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2], [120, 90, 60, 30, 0, -30, -60, -90, -120]);'
    
    $c = $c -replace 'const cardTranslateY = useTransform\([\s\S]*?\]\s*\);', 'const cardTranslateY = useTransform(relativeProgress, [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2], [-866, -1000, -866, -500, 0, 500, 866, 1000, 866]);'
    
    $c = $c -replace 'const cardTranslateZ = useTransform\([\s\S]*?\]\s*\);', 'const cardTranslateZ = useTransform(relativeProgress, [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2], [-1500, -1000, -500, -134, 0, -134, -500, -1000, -1500]);'
    
    $c = $c -replace 'const cardScale = useTransform\([\s\S]*?\]\s*\);', 'const cardScale = useTransform(relativeProgress, [-2, -1, 0, 1, 2], [0.6, 0.8, 1, 0.8, 0.6]);'
    
    $c = $c -replace 'const cardOpacity = useTransform\([\s\S]*?\]\s*\);', 'const cardOpacity = useTransform(relativeProgress, [-1.5, -0.8, -0.2, 0, 0.2, 0.8, 1.5], [0, 0.3, 0.9, 1, 0.9, 0.3, 0]);'

    # Replace Container Transforms
    $c = $c -replace 'const rawContainerRotateX = useTransform\([\s\S]*?\]\s*\);', 'const rawContainerRotateX = useTransform(rawDistance, [0, 0.2, 0.5], [0, -20, -55]);'
    $c = $c -replace 'const rawContainerTranslateY = useTransform\([\s\S]*?\]\s*\);', 'const rawContainerTranslateY = useTransform(rawDistance, [0, 0.2, 0.5], [0, 150, 450]);'
    $c = $c -replace 'const rawContainerTranslateZ = useTransform\([\s\S]*?\]\s*\);', 'const rawContainerTranslateZ = useTransform(rawDistance, [0, 0.2, 0.5], [0, -200, -700]);'
    
    return $c
}
