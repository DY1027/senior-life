$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

function Export-Jpeg {
  param(
    [Parameter(Mandatory = $true)][string]$InputPath,
    [Parameter(Mandatory = $true)][string]$OutputPath,
    [Parameter(Mandatory = $true)][int]$Width,
    [Parameter(Mandatory = $true)][int]$Height,
    [int]$Quality = 84
  )

  $source = [System.Drawing.Image]::FromFile((Resolve-Path $InputPath))
  try {
    $canvas = New-Object System.Drawing.Bitmap($Width, $Height)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($canvas)
      try {
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

        $scale = [Math]::Min($Width / $source.Width, $Height / $source.Height)
        $drawWidth = [int][Math]::Round($source.Width * $scale)
        $drawHeight = [int][Math]::Round($source.Height * $scale)
        $x = [int](($Width - $drawWidth) / 2)
        $y = [int](($Height - $drawHeight) / 2)
        $graphics.DrawImage($source, $x, $y, $drawWidth, $drawHeight)
      }
      finally {
        $graphics.Dispose()
      }

      $directory = Split-Path -Parent $OutputPath
      New-Item -ItemType Directory -Force -Path $directory | Out-Null
      $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq "image/jpeg" }
      $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality,
        [long]$Quality
      )
      $canvas.Save($OutputPath, $codec, $parameters)
      $parameters.Dispose()
    }
    finally {
      $canvas.Dispose()
    }
  }
  finally {
    $source.Dispose()
  }
}

Export-Jpeg -InputPath "design-assets/shopping/originals/usb-c-cable-white-2m.png" -OutputPath "public/images/shopping/products/digital/usb-c-cable-white-2m.jpg" -Width 800 -Height 800
Export-Jpeg -InputPath "design-assets/shopping/originals/compact-umbrella-navy.png" -OutputPath "public/images/shopping/products/rainy-season/compact-umbrella-navy.jpg" -Width 800 -Height 800
Export-Jpeg -InputPath "design-assets/shopping/originals/dehumidifier-box-eight-pack.png" -OutputPath "public/images/shopping/products/rainy-season/dehumidifier-box-eight-pack.jpg" -Width 800 -Height 800
Export-Jpeg -InputPath "design-assets/shopping/originals/anti-slip-tape-clear.png" -OutputPath "public/images/shopping/products/rainy-season/anti-slip-tape-clear.jpg" -Width 800 -Height 800
Export-Jpeg -InputPath "design-assets/shopping/originals/waterproof-shoe-covers-blue.png" -OutputPath "public/images/shopping/products/rainy-season/waterproof-shoe-covers-blue.jpg" -Width 800 -Height 800
Export-Jpeg -InputPath "design-assets/shopping/originals/usb-c-charger-20w-white.png" -OutputPath "public/images/shopping/products/digital/usb-c-charger-20w-white.jpg" -Width 800 -Height 800
Export-Jpeg -InputPath "design-assets/shopping/originals/power-bank-10000-white.png" -OutputPath "public/images/shopping/products/digital/power-bank-10000-white.jpg" -Width 800 -Height 800
Export-Jpeg -InputPath "design-assets/shopping/originals/phone-stand-foldable-silver.png" -OutputPath "public/images/shopping/products/digital/phone-stand-foldable-silver.jpg" -Width 800 -Height 800
Export-Jpeg -InputPath "design-assets/shopping/originals/stylus-pen-universal-black.png" -OutputPath "public/images/shopping/products/digital/stylus-pen-universal-black.jpg" -Width 800 -Height 800
Export-Jpeg -InputPath "design-assets/shopping/originals/screen-magnifier-12inch-black.png" -OutputPath "public/images/shopping/products/digital/screen-magnifier-12inch-black.jpg" -Width 800 -Height 800
Export-Jpeg -InputPath "design-assets/shopping/originals/rainy-season-budget.png" -OutputPath "public/images/shopping/missions/rainy-season-budget.jpg" -Width 1200 -Height 900 -Quality 86
Copy-Item -LiteralPath "public/images/shopping/missions/rainy-season-budget.jpg" -Destination "public/images/shopping/hero/shopping-practice-hero.jpg" -Force
