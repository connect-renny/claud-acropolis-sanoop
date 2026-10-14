<?php require_once __DIR__ . '/config.php'; ?>
<!doctype html>
<html lang="en" dir="ltr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title><?= e($page['title']) ?></title>
<meta name="description" content="<?= e($page['description']) ?>">

<meta property="og:type" content="website">
<meta property="og:title" content="<?= e($page['title']) ?>">
<meta property="og:description" content="<?= e($page['og_description']) ?>">
<meta property="og:image" content="assets/images/<?= e($page['image']) ?>">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="assets/images/favicon-192.png">
<link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">
<meta name="theme-color" content="#ffffff">

<!-- The one font file, preloaded so text renders in it on first paint.
     Keep in sync with scss/base/_fonts.scss. -->
<link rel="preload" href="assets/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<a class="skip-link" href="#main">Skip to content</a>
