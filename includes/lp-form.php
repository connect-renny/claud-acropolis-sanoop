<?php
// ═══════════════════════════════════════════════════════════════════════════
//  Lead form, rendered from LEAD_FORMS (includes/leads.php).
//
//  Set before including:
//    $lead_form    key in LEAD_FORMS ("infrastructure" | "domain" | "callback")
//    $lead_full    field names that span both columns
//    $lead_submit  submit button label
//    $lead_compact optional; true for the short hero form (2-row message,
//                  no privacy note)
//
//  ?service=<key> in the URL preselects the service (ad sitelinks can use it);
//  CTA buttons with data-service do the same in place via landing.js.
//  Attribution fields are filled here from the URL and topped up by
//  landing.js from what it stored on the visitor's first landing.
// ═══════════════════════════════════════════════════════════════════════════

require_once __DIR__ . '/leads.php';

$lf = LEAD_FORMS[$lead_form];
$lf_pre = isset($lf['services'][$_GET['service'] ?? '']) ? $_GET['service'] : '';
$lf_ui = [
    'name' => ['type' => 'text', 'autocomplete' => 'name'],
    'company' => ['type' => 'text', 'autocomplete' => 'organization'],
    'email' => ['type' => 'email', 'autocomplete' => 'email'],
    'phone' => ['type' => 'tel', 'autocomplete' => 'tel', 'placeholder' => '+968'],
    'domain' => ['type' => 'text', 'autocomplete' => 'off', 'placeholder' => 'yourcompany.om'],
];
$lf_id = fn($name) => $lead_form . '-' . $name;
$lf_error = ($_GET['lead_error'] ?? '') === $lead_form;
$lf_compact = $lead_compact ?? false;
$lf_placeholder = [
    'infrastructure' => 'Workload, CPU / RAM / storage, operating system, rack space, timeline…',
    'domain' => 'Anything we should know?',
    'callback' => 'What do you need? e.g. Linux VM, GPU server, colocation…',
][$lead_form];
?>
<form class="ca-form lp-form<?= $lf_compact ? ' lp-form--compact' : '' ?>" action="lead.php" method="post" data-lead="<?= e($lead_form) ?>" novalidate>
  <p class="form-status" role="status" aria-live="polite"<?= $lf_error ? ' data-state="error"' : '' ?>><?= $lf_error ? 'We couldn&rsquo;t send your request. Please check the details below and try again, or call us on ' . PHONE_DISPLAY . '.' : '' ?></p>
  <div class="ca-grid">
<?php foreach ($lf['fields'] as $name => [$label, $required, $max, $type]):
    $id = $lf_id($name);
    $full = in_array($name, $lead_full, true) ? ' ca-field--full' : '';
    $req = $required ? ' required' : '';
?>
    <div class="ca-field<?= $full ?>">
      <label for="<?= $id ?>"><?= e($label) ?><?= $required ? ' <span class="req" aria-hidden="true">*</span>' : ' <span class="opt">(optional)</span>' ?></label>
<?php if ($type === 'service'): ?>
      <select class="ca-input ca-select" id="<?= $id ?>" name="<?= $name ?>"<?= $req ?> data-error="Please choose a service.">
        <option value=""<?= $lf_pre ? '' : ' selected' ?> disabled>Select a service</option>
<?php foreach ($lf['services'] as $key => $svc): ?>
        <option value="<?= e($key) ?>"<?= $key === $lf_pre ? ' selected' : '' ?>><?= e($svc) ?></option>
<?php endforeach; ?>
      </select>
<?php elseif ($name === 'message'): ?>
      <textarea class="ca-input" id="<?= $id ?>" name="<?= $name ?>" rows="<?= $lf_compact ? 2 : 4 ?>" maxlength="<?= $max ?>"<?= $req ?> placeholder="<?= e($lf_placeholder) ?>"></textarea>
<?php else:
    $ui = $lf_ui[$name];
?>
      <input class="ca-input" id="<?= $id ?>" name="<?= $name ?>" type="<?= $ui['type'] ?>" autocomplete="<?= $ui['autocomplete'] ?>" maxlength="<?= $max ?>"<?= isset($ui['placeholder']) ? ' placeholder="' . e($ui['placeholder']) . '"' : '' ?><?= $name === 'domain' ? ' autocapitalize="off" spellcheck="false" value="' . e(lead_clean($_GET['query'] ?? '', $max)) . '"' : '' ?><?= $req ?>>
<?php endif; ?>
    </div>
<?php endforeach; ?>
  </div>

  <input type="hidden" name="form" value="<?= e($lead_form) ?>">
  <input type="hidden" name="_t" value="<?= e(lead_token()) ?>">
  <input type="hidden" name="landing_page" value="<?= e($lf['page']) ?>">
  <input type="hidden" name="referrer" value="" data-attr="referrer">
<?php foreach (LEAD_ATTRIBUTION as $key): ?>
  <input type="hidden" name="<?= $key ?>" value="<?= e(lead_clean($_GET[$key] ?? '', 255)) ?>" data-attr="<?= $key ?>">
<?php endforeach; ?>
  <div class="form-hp" aria-hidden="true"><label for="<?= $lf_id('website') ?>">Website</label><input id="<?= $lf_id('website') ?>" name="website" type="text" tabindex="-1" autocomplete="off"></div>

  <button class="btn btn-primary btn-lg btn-block" type="submit"><?= e($lead_submit) ?> <span class="arrow">→</span></button>
<?php if (!$lf_compact): ?>
  <p class="ca-form-note">We use your details only to respond to this enquiry. See our <a href="<?= PRIVACY_URL ?>">Privacy Policy</a>.</p>
<?php endif; ?>
</form>
