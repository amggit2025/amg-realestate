# Test Image Upload API
# This script tests the /api/upload/image endpoint

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🔥 Test Cloudinary Image Upload" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if server is running
Write-Host "📡 Checking if dev server is running..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "✅ Server is running on port 3000" -ForegroundColor Green
} catch {
    Write-Host "❌ Server is not running! Please run: npm run dev" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📥 Downloading test image from Unsplash..." -ForegroundColor Blue

# Download a test image
$testImageUrl = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"
$tempImagePath = "$env:TEMP\test-image.jpg"

try {
    Invoke-WebRequest -Uri $testImageUrl -OutFile $tempImagePath
    Write-Host "✅ Test image downloaded: $tempImagePath" -ForegroundColor Green
    
    $fileInfo = Get-Item $tempImagePath
    Write-Host "   - Size: $([math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to download test image" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📤 Uploading image to /api/upload/image..." -ForegroundColor Blue

try {
    # Create multipart form data
    $boundary = [System.Guid]::NewGuid().ToString()
    $fileContent = [System.IO.File]::ReadAllBytes($tempImagePath)
    
    # Build form data manually
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"test-image.jpg`"",
        "Content-Type: image/jpeg",
        "",
        [System.Text.Encoding]::GetEncoding('ISO-8859-1').GetString($fileContent),
        "--$boundary--"
    )
    
    $body = $bodyLines -join "`r`n"
    
    $response = Invoke-RestMethod `
        -Uri "http://localhost:3000/api/upload/image" `
        -Method POST `
        -ContentType "multipart/form-data; boundary=$boundary" `
        -Body ([System.Text.Encoding]::GetEncoding('ISO-8859-1').GetBytes($body))
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "           📊 RESULT" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    if ($response.success) {
        Write-Host "✅ UPLOAD SUCCESS!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📸 Image Details:" -ForegroundColor Cyan
        Write-Host "   - URL: $($response.data.url)" -ForegroundColor White
        Write-Host "   - Public ID: $($response.data.public_id)" -ForegroundColor White
        Write-Host "   - Dimensions: $($response.data.width) x $($response.data.height)" -ForegroundColor White
        Write-Host "   - Format: $($response.data.format)" -ForegroundColor White
        Write-Host ""
        Write-Host "🌐 View image: $($response.data.url)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ UPLOAD FAILED!" -ForegroundColor Red
        Write-Host "   Message: $($response.message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails) {
        Write-Host ""
        Write-Host "Error Details:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Cleanup
if (Test-Path $tempImagePath) {
    Remove-Item $tempImagePath -Force
    Write-Host "🧹 Cleaned up temporary files" -ForegroundColor Gray
}

Write-Host ""
