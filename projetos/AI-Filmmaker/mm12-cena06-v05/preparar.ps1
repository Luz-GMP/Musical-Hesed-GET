<#
  Sincroniza as bases v05 e as camadas 2.5D de entregas/MM12/pacote-2p5d-v05/recriacao-por-camadas/
  para projetos/AI-Filmmaker/mm12-cena06-v05/cena/assets/ (fora do Git, conforme P-13)
  e gera cena/assets/manifesto-camadas.json detectando automaticamente quais cenas ja tem camadas RGBA completas.
#>
$ErrorActionPreference = 'Stop'

$projRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $projRoot '..\..\..')).Path
$srcRoot  = Join-Path $repoRoot 'entregas\MM12\pacote-2p5d-v05\recriacao-por-camadas'
$dstRoot  = Join-Path $projRoot 'cena\assets'

$dstBases  = Join-Path $dstRoot 'bases-v05'
$dstLayers = Join-Path $dstRoot 'layers-v05'
New-Item -ItemType Directory -Path $dstBases, $dstLayers -Force | Out-Null

# 1. Copiar todas as 8 bases unificadas v05
$baseNames = @('MM12-Q01.png','MM12-Q02.png','MM12-Q07.png','MM12-Q03.png','MM12-Q04.png','MM12-Q05.png','MM12-Q08.png','MM12-Q06.png')
$copiedBases = @{}
foreach ($name in $baseNames) {
  $src = Join-Path (Join-Path $srcRoot 'bases-v05') $name
  if (!(Test-Path $src)) { throw "Base ausente: $src" }
  $dst = Join-Path $dstBases $name
  Copy-Item $src $dst -Force
  $copiedBases[$name] = @{
    path   = "assets/bases-v05/$name"
    bytes  = (Get-Item $dst).Length
    sha256 = (Get-FileHash $dst -Algorithm SHA256).Hash.ToLower()
  }
}

# 2. Definir pilhas 2.5D esperadas por cena e copiar todas as camadas presentes
$expectedStacks = [ordered]@{
  'Q01' = @{
    folder = 'MM12-Q01'
    files  = @(
      'MM12-Q01-L01-BG-cleanplate.png',
      'MM12-Q01-L02-MG-vale-trilha.png',
      'MM12-Q01-L03-FG-dir-pedras-arbustos.png',
      'MM12-Q01-L04-FG-esq-muro-oliveira.png'
    )
  }
  'Q02' = @{
    folder = 'MM12-Q02'
    files  = @(
      'MM12-Q02-L01-BG-cleanplate.png',
      'MM12-Q02-L02-MG-belem-estrada.png',
      'MM12-Q02-L03-FG-esq-rochas.png',
      'MM12-Q02-L04-FG-dir-oliveiras.png'
    )
  }
  'Q07' = @{
    folder = 'MM12-Q07'
    files  = @(
      'MM12-Q07-L01-BG-cleanplate.png',
      'MM12-Q07-L02-MG-casario-entrada.png',
      'MM12-Q07-L03-FG-esq-fachada-pedra.png',
      'MM12-Q07-L04-FG-dir-muro-oliveira.png'
    )
  }
  'Q03' = @{
    folder = 'MM12-Q03-Q04'
    files  = @(
      'MM12-Q03-L01-BG-ceu-crepusculo.png',
      'MM12-Q03-L02-MG-viela-fundo.png',
      'MM12-Q03-L03-FG-dir-muro-oliveira.png',
      'MM12-Q03-L04-FG-esq-casa-porta.png'
    )
  }
  'Q04' = @{
    folder = 'MM12-Q03-Q04'
    files  = @(
      'MM12-Q04-L01-BG-ceu-noite.png',
      'MM12-Q04-L02-MG-viela-fundo.png',
      'MM12-Q04-L03-FG-dir-muro-oliveira.png',
      'MM12-Q04-L04-FG-esq-casa-porta.png'
    )
  }
  'Q05' = @{
    folder = 'MM12-Q05'
    files  = @(
      'MM12-Q05-L01-BG-cleanplate.png',
      'MM12-Q05-L02-MG-rua-mureta.png',
      'MM12-Q05-L03-FG-esq-fachada-porta.png',
      'MM12-Q05-L04-OBJ-banco-jarros.png'
    )
  }
  'Q08' = @{
    folder = 'MM12-Q08'
    files  = @(
      'MM12-Q08-L01-BG-cleanplate.png',
      'MM12-Q08-L02-MG-belem-ciprestes.png',
      'MM12-Q08-L03-FG-esq-esquina-viela.png',
      'MM12-Q08-L04-FG-dir-muro-vegetacao.png'
    )
  }
  'Q06' = @{
    folder = 'MM12-Q06'
    files  = @(
      'MM12-Q06-L01-BG-cleanplate.png',
      'MM12-Q06-L02-MG-belem-ciprestes.png',
      'MM12-Q06-L03-FG-dir-mureta-chao.png',
      'MM12-Q06-L04-FG-esq-estabulo.png',
      'MM12-Q06-L05-OBJ-anforas.png'
    )
  }
}

$sceneManifest = [ordered]@{}
foreach ($key in $expectedStacks.Keys) {
  $spec = $expectedStacks[$key]
  $srcDir = Join-Path (Join-Path $srcRoot 'layers-v05') $spec.folder
  $dstDir = Join-Path $dstLayers $spec.folder
  $present = @()
  $missing = @()
  foreach ($f in $spec.files) {
    $src = Join-Path $srcDir $f
    if (Test-Path $src) {
      New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
      $dst = Join-Path $dstDir $f
      Copy-Item $src $dst -Force
      $present += "assets/layers-v05/$($spec.folder)/$f"
    } else {
      $missing += $f
    }
  }
  $isFull2p5d = ($missing.Count -eq 0)
  $layersArr = New-Object System.Collections.ArrayList
  if ($isFull2p5d) { foreach ($p in $present) { [void]$layersArr.Add($p) } }
  $missingArr = New-Object System.Collections.ArrayList
  foreach ($m in $missing) { [void]$missingArr.Add($m) }
  $sceneManifest[$key] = [ordered]@{
    mode    = if ($isFull2p5d) { '2.5d-layers' } else { 'base-fallback' }
    base    = "assets/bases-v05/MM12-$key.png"
    layers  = $layersArr
    present = $present.Count
    total   = $spec.files.Count
    missing = $missingArr
  }
  Write-Output ("{0}: {1} ({2}/{3} camadas)" -f $key, $sceneManifest[$key].mode, $present.Count, $spec.files.Count)
}

$manifestObj = [ordered]@{
  generatedAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:sszzz')
  sourceRoot  = 'entregas/MM12/pacote-2p5d-v05/recriacao-por-camadas'
  scenes      = $sceneManifest
}
$manifestJson = $manifestObj | ConvertTo-Json -Depth 6
$manifestJs   = "window.MM12_V05_MANIFEST = $manifestJson;`n"
[System.IO.File]::WriteAllText((Join-Path $dstRoot 'manifesto-camadas.json'), $manifestJson, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText((Join-Path $dstRoot 'manifesto-camadas.js'), $manifestJs, [System.Text.UTF8Encoding]::new($false))

# 3. Gerar cena/index.html com tags <img hidden> estaticas e registro sincrono da timeline (HyperFrames 0.9.72)
$uniqueUrls = New-Object System.Collections.Generic.List[string]
foreach ($key in $sceneManifest.Keys) {
  $sc = $sceneManifest[$key]
  if (-not $uniqueUrls.Contains($sc.base)) { $uniqueUrls.Add($sc.base) }
  foreach ($l in $sc.layers) {
    if (-not $uniqueUrls.Contains($l)) { $uniqueUrls.Add($l) }
  }
}
$imgTags = ($uniqueUrls | ForEach-Object { "    <img hidden data-asset=`"$_`" src=`"$_`" alt=`"`">" }) -join "`n"
$indexHtml = @"
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HESED · Cena 6 · MM-12 · Plano-sequência 2.5D v05</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; background: #0c131d; }
    main { position: relative; width: 1920px; height: 1080px; overflow: hidden; background: #0c131d; }
    canvas { display: block; width: 1920px; height: 1080px; }
  </style>
  <script src="assets/manifesto-camadas.js"></script>
  <script src="plano-sequencia.js"></script>
</head>
<body>
  <main id="composition" data-composition-id="hesed-mm12-cena06-v05" data-start="0" data-duration="112" data-width="1920" data-height="1080" data-fps="30">
    <canvas id="stage" class="clip" data-start="0" data-duration="112" data-track-index="0" width="1920" height="1080" aria-label="HESED Cena 6 MM-12 Plano-sequência 2.5D v05"></canvas>
$imgTags
  </main>
  <script>
    (function () {
      const cache = new Map();
      document.querySelectorAll('img[data-asset]').forEach(img => {
        cache.set(img.dataset.asset, img);
      });
      const engine = window.MM12PlanoSequencia.mountSync(document.getElementById('stage'), cache);
      window.__mm12Engine = engine;
      window.__timelines = window.__timelines || {};
      window.__timelines['hesed-mm12-cena06-v05'] = engine.timeline;
      const queryTime = Number(new URLSearchParams(location.search).get('t'));
      if (Number.isFinite(queryTime)) engine.renderAt(queryTime);
      window.addEventListener('load', () => engine.renderAt(engine.timeline.time()));
    }());
  </script>
</body>
</html>
"@
[System.IO.File]::WriteAllText((Join-Path $projRoot 'cena\index.html'), $indexHtml, [System.Text.UTF8Encoding]::new($false))
Write-Output "Manifesto e cena/index.html estatico gerados ($($uniqueUrls.Count) imagens pre-carregadas)."
