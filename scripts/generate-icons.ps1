param(
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\assets')
)

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -LiteralPath $OutputDirectory)) {
  New-Item -ItemType Directory -Path $OutputDirectory | Out-Null
}

foreach ($size in @(192, 512)) {
  $bitmap = [System.Drawing.Bitmap]::new($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#C4261D'))
  $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)

  $scale = $size / 512
  $graphics.FillRectangle($brush, [int](86 * $scale), [int](104 * $scale), [int](340 * $scale), [int](52 * $scale))
  $graphics.FillRectangle($brush, [int](86 * $scale), [int](356 * $scale), [int](340 * $scale), [int](52 * $scale))
  $graphics.FillRectangle($brush, [int](86 * $scale), [int](208 * $scale), [int](238 * $scale), [int](96 * $scale))

  $path = Join-Path $OutputDirectory "cdi-$size.png"
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $brush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}
