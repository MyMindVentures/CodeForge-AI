export const HARDCODED_STEPS = [
  {
    step_no: 1,
    step_id: "STEP-001",
    phase: "Initialization",
    stage: "Context",
    step: "Load project context",
    task: "load_core_project_metadata_and_active_configuration",
    script_name: "step_001_load_project_context",
    pass_condition: "project_context_loaded_and_valid"
  },
  {
    step_no: 2,
    step_id: "STEP-002",
    phase: "Initialization",
    stage: "Binding",
    step: "Resolve repository binding",
    task: "resolve_git_or_local_connector_binding_for_the_run",
    script_name: "step_002_resolve_repository_binding",
    pass_condition: "binding_resolved"
  },
  {
    step_no: 3,
    step_id: "STEP-003",
    phase: "Initialization",
    stage: "Boilerplate",
    step: "Select boilerplate profile",
    task: "choose_the_best_reusable_boilerplate_for_the_project",
    script_name: "step_003_select_boilerplate_profile",
    pass_condition: "boilerplate_selected"
  },
  {
    step_no: 4,
    step_id: "STEP-004",
    phase: "Initialization",
    stage: "Workspace",
    step: "Hydrate workspace from boilerplate",
    task: "create_run_workspace_from_the_selected_template",
    script_name: "step_004_hydrate_workspace_from_boilerplate",
    pass_condition: "workspace_hydrated"
  },
  {
    step_no: 5,
    step_id: "STEP-005",
    phase: "Initialization",
    stage: "Sync",
    step: "Sync repository into workspace",
    task: "pull_or_mount_the_project_repository_into_the_run_workspace",
    script_name: "step_005_sync_repository_into_workspace",
    pass_condition: "repository_synced"
  },
  {
    step_no: 6,
    step_id: "STEP-006",
    phase: "Blueprint Compilation",
    stage: "Loading",
    step: "Load source documents",
    task: "load_all_project_documentation_for_blueprint_compilation",
    script_name: "step_006_load_source_documents",
    pass_condition: "all_documents_loaded"
  },
  {
    step_no: 7,
    step_id: "STEP-007",
    phase: "Blueprint Compilation",
    stage: "Fingerprinting",
    step: "Fingerprint documents",
    task: "compute_hashes_and_change_detection_for_all_docs",
    script_name: "step_007_fingerprint_documents",
    pass_condition: "fingerprints_generated"
  },
  {
    step_no: 8,
    step_id: "STEP-008",
    phase: "Blueprint Compilation",
    stage: "Extraction",
    step: "Extract document sections",
    task: "split_all_docs_into_semantic_sections",
    script_name: "step_008_extract_document_sections",
    pass_condition: "sections_extracted"
  },
  {
    step_no: 9,
    step_id: "STEP-009",
    phase: "Blueprint Compilation",
    stage: "Normalization",
    step: "Normalize requirements",
    task: "convert_human_requirements_into_structured_requirement_units",
    script_name: "step_009_normalize_requirements",
    pass_condition: "requirements_normalized"
  },
  {
    step_no: 10,
    step_id: "STEP-010",
    phase: "Blueprint Compilation",
    stage: "Conflict Detection",
    step: "Detect documentation conflicts",
    task: "identify_conflicts_and_ambiguities_before_blueprint_publish",
    script_name: "step_010_detect_documentation_conflicts",
    pass_condition: "conflicts_processed"
  },
  {
    step_no: 11,
    step_id: "STEP-011",
    phase: "Blueprint Compilation",
    stage: "Manifest",
    step: "Compile blueprint manifest",
    task: "create_a_new_blueprint_version_manifest",
    script_name: "step_011_compile_blueprint_manifest",
    pass_condition: "manifest_compiled"
  },
  {
    step_no: 12,
    step_id: "STEP-012",
    phase: "Blueprint Compilation",
    stage: "Records",
    step: "Compile blueprint records",
    task: "generate_all_blueprint_entities_for_database_storage",
    script_name: "step_012_compile_blueprint_records",
    pass_condition: "blueprint_records_compiled"
  },
  {
    step_no: 13,
    step_id: "STEP-013",
    phase: "Blueprint Compilation",
    stage: "Traceability",
    step: "Link traceability",
    task: "attach_source_traceability_to_every_blueprint_record",
    script_name: "step_013_link_traceability",
    pass_condition: "traceability_linked"
  },
  {
    step_no: 14,
    step_id: "STEP-014",
    phase: "Blueprint Compilation",
    stage: "Publishing",
    step: "Publish blueprint version",
    task: "mark_the_compiled_blueprint_as_active_for_the_run",
    script_name: "step_014_publish_blueprint_version",
    pass_condition: "blueprint_published"
  },
  {
    step_no: 15,
    step_id: "STEP-015",
    phase: "Blueprint Compilation",
    stage: "Documentation",
    step: "Generate project documentation set",
    task: "create_detailed_database_backed_project_documentation",
    script_name: "step_015_generate_project_documentation_set",
    pass_condition: "project_documentation_generated"
  },
  {
    step_no: 16,
    step_id: "STEP-016",
    phase: "Execution Planning",
    stage: "Manifest",
    step: "Generate step plan manifest",
    task: "start_a_new_database_backed_execution_plan",
    script_name: "step_016_generate_step_plan_manifest",
    pass_condition: "step_plan_manifest_created"
  },
  {
    step_no: 17,
    step_id: "STEP-017",
    phase: "Execution Planning",
    stage: "Phases",
    step: "Generate phases",
    task: "create_execution_phases_in_database",
    script_name: "step_017_generate_phases",
    pass_condition: "phases_created"
  },
  {
    step_no: 18,
    step_id: "STEP-018",
    phase: "Execution Planning",
    stage: "Stages",
    step: "Generate stages",
    task: "create_ordered_stages_under_each_phase",
    script_name: "step_018_generate_stages",
    pass_condition: "stages_created"
  },
  {
    step_no: 19,
    step_id: "STEP-019",
    phase: "Execution Planning",
    stage: "Steps",
    step: "Generate steps",
    task: "create_detailed_execution_steps_under_each_stage",
    script_name: "step_019_generate_steps",
    pass_condition: "steps_created"
  },
  {
    step_no: 20,
    step_id: "STEP-020",
    phase: "Execution Planning",
    stage: "Tasks",
    step: "Generate tasks and checks",
    task: "create_bounded_tasks_and_validation_checks_for_each_step",
    script_name: "step_020_generate_tasks_and_checks",
    pass_condition: "tasks_and_checks_created"
  },
  {
    step_no: 21,
    step_id: "STEP-021",
    phase: "Run Management",
    stage: "Initialization",
    step: "Open run record",
    task: "initialize_the_run_and_bind_blueprint_plan_and_repo",
    script_name: "step_021_open_run_record",
    pass_condition: "run_record_opened"
  },
  {
    step_no: 22,
    step_id: "STEP-022",
    phase: "Run Management",
    stage: "Telemetry",
    step: "Bootstrap telemetry",
    task: "initialize_step_execution_tracking_for_the_run",
    script_name: "step_022_bootstrap_telemetry",
    pass_condition: "telemetry_bootstrapped"
  },
  {
    step_no: 23,
    step_id: "STEP-023",
    phase: "Implementation",
    stage: "Scanning",
    step: "Scan codebase",
    task: "inspect_current_repo_state_before_planning_changes",
    script_name: "step_023_scan_codebase",
    pass_condition: "repo_scanned"
  },
  {
    step_no: 24,
    step_id: "STEP-024",
    phase: "Implementation",
    stage: "Gap Analysis",
    step: "Build gap report",
    task: "compare_repo_state_to_blueprint_and_step_plan",
    script_name: "step_024_build_gap_report",
    pass_condition: "gap_report_created"
  },
  {
    step_no: 25,
    step_id: "STEP-025",
    phase: "Implementation",
    stage: "Prioritization",
    step: "Prioritize backlog",
    task: "convert_gaps_into_a_bounded_prioritized_backlog",
    script_name: "step_025_prioritize_backlog",
    pass_condition: "backlog_prioritized"
  },
  {
    step_no: 26,
    step_id: "STEP-026",
    phase: "Implementation",
    stage: "Selection",
    step: "Select next bounded task",
    task: "choose_the_next_task_strictly_from_the_database_plan",
    script_name: "step_026_select_next_bounded_task",
    pass_condition: "active_task_selected"
  },
  {
    step_no: 27,
    step_id: "STEP-027",
    phase: "Implementation",
    stage: "Guard",
    step: "Run architecture guard",
    task: "ensure_the_selected_task_respects_platform_architecture_rules",
    script_name: "step_027_run_architecture_guard",
    pass_condition: "architecture_guard_passed"
  },
  {
    step_no: 28,
    step_id: "STEP-028",
    phase: "Implementation",
    stage: "Patching",
    step: "Generate implementation patch",
    task: "generate_or_modify_code_for_the_active_task",
    script_name: "step_028_generate_implementation_patch",
    pass_condition: "code_patch_generated"
  },
  {
    step_no: 29,
    step_id: "STEP-029",
    phase: "Implementation",
    stage: "Testing",
    step: "Generate tests for patch",
    task: "create_or_update_tests_required_by_the_task",
    script_name: "step_029_generate_tests_for_patch",
    pass_condition: "tests_generated"
  },
  {
    step_no: 30,
    step_id: "STEP-030",
    phase: "Implementation",
    stage: "Persistence",
    step: "Persist patch metadata",
    task: "store_diff_and_traceability_for_the_change",
    script_name: "step_030_persist_patch_metadata",
    pass_condition: "patch_metadata_persisted"
  },
  {
    step_no: 31,
    step_id: "STEP-031",
    phase: "Quality Assurance",
    stage: "Typecheck",
    step: "Run typecheck",
    task: "validate_static_types_after_changes",
    script_name: "step_031_run_typecheck",
    pass_condition: "typecheck_passed"
  },
  {
    step_no: 32,
    step_id: "STEP-032",
    phase: "Quality Assurance",
    stage: "Lint",
    step: "Run lint",
    task: "validate_code_quality_rules",
    script_name: "step_032_run_lint",
    pass_condition: "lint_passed"
  },
  {
    step_no: 33,
    step_id: "STEP-033",
    phase: "Quality Assurance",
    stage: "Unit Tests",
    step: "Run unit tests",
    task: "validate_local_logic_and_small_units",
    script_name: "step_033_run_unit_tests",
    pass_condition: "unit_tests_passed"
  },
  {
    step_no: 34,
    step_id: "STEP-034",
    phase: "Quality Assurance",
    stage: "Integration Tests",
    step: "Run integration tests",
    task: "validate_feature_composition_and_state_interactions",
    script_name: "step_034_run_integration_tests",
    pass_condition: "integration_tests_passed"
  },
  {
    step_no: 35,
    step_id: "STEP-035",
    phase: "Quality Assurance",
    stage: "Build",
    step: "Build application",
    task: "confirm_the_application_builds_successfully",
    script_name: "step_035_build_application",
    pass_condition: "build_passed"
  },
  {
    step_no: 36,
    step_id: "STEP-036",
    phase: "Preview",
    stage: "Provisioning",
    step: "Provision sandbox runtime",
    task: "launch_or_refresh_the_live_preview_environment",
    script_name: "step_036_provision_sandbox_runtime",
    pass_condition: "sandbox_live"
  },
  {
    step_no: 37,
    step_id: "STEP-037",
    phase: "Preview",
    stage: "Smoke Check",
    step: "Run sandbox smoke check",
    task: "verify_the_preview_runtime_is_accessible_and_healthy",
    script_name: "step_037_run_sandbox_smoke_check",
    pass_condition: "sandbox_smoke_passed"
  },
  {
    step_no: 38,
    step_id: "STEP-038",
    phase: "Preview",
    stage: "E2E Tests",
    step: "Run end-to-end tests",
    task: "validate_critical_user_flows_against_the_live_runtime",
    script_name: "step_038_run_end_to_end_tests",
    pass_condition: "e2e_passed"
  },
  {
    step_no: 39,
    step_id: "STEP-039",
    phase: "Preview",
    stage: "Accessibility",
    step: "Run accessibility checks",
    task: "validate_accessibility_rules_and_critical_a11y_requirements",
    script_name: "step_039_run_accessibility_checks",
    pass_condition: "accessibility_checks_passed"
  },
  {
    step_no: 40,
    step_id: "STEP-040",
    phase: "Preview",
    stage: "Evidence",
    step: "Capture UI evidence",
    task: "capture_screenshots_and_runtime_visual_evidence",
    script_name: "step_040_capture_ui_evidence",
    pass_condition: "ui_evidence_captured"
  },
  {
    step_no: 41,
    step_id: "STEP-041",
    phase: "Preview",
    stage: "Visual Regression",
    step: "Run visual regression checks",
    task: "compare_current_ui_to_visual_baselines_and_rules",
    script_name: "step_041_run_visual_regression_checks",
    pass_condition: "visual_checks_passed"
  },
  {
    step_no: 42,
    step_id: "STEP-042",
    phase: "Preview",
    stage: "Fidelity",
    step: "Evaluate design fidelity",
    task: "verify_alignment_with_blueprint_ui_ux_rules",
    script_name: "step_042_evaluate_design_fidelity",
    pass_condition: "design_fidelity_passed"
  },
  {
    step_no: 43,
    step_id: "STEP-043",
    phase: "Monitoring",
    stage: "Telemetry",
    step: "Update step telemetry",
    task: "push_logs_statuses_evidence_and_retry_counts_to_monitoring",
    script_name: "step_043_update_step_telemetry",
    pass_condition: "telemetry_updated"
  },
  {
    step_no: 44,
    step_id: "STEP-044",
    phase: "Monitoring",
    stage: "Classification",
    step: "Classify failures",
    task: "classify_any_detected_failures_into_structured_issue_types",
    script_name: "step_044_classify_failures",
    pass_condition: "failures_classified"
  },
  {
    step_no: 45,
    step_id: "STEP-045",
    phase: "Monitoring",
    stage: "Repair",
    step: "Execute repair loop",
    task: "repair_failed_or_incomplete_surfaces_until_green_or_policy_block",
    script_name: "step_045_execute_repair_loop",
    pass_condition: "no_open_repairable_failures_remain"
  },
  {
    step_no: 46,
    step_id: "STEP-046",
    phase: "Monitoring",
    stage: "Validation",
    step: "Re-run impacted validations",
    task: "rerun_all_checks_affected_by_the_repair_loop",
    script_name: "step_046_rerun_impacted_validations",
    pass_condition: "impacted_validations_passed"
  },
  {
    step_no: 47,
    step_id: "STEP-047",
    phase: "Release Assessment",
    stage: "Coverage",
    step: "Compute blueprint coverage",
    task: "measure_how_much_of_the_blueprint_is_fully_implemented_and_verified",
    script_name: "step_047_compute_blueprint_coverage",
    pass_condition: "coverage_report_generated"
  },
  {
    step_no: 48,
    step_id: "STEP-048",
    phase: "Release Assessment",
    stage: "Gates",
    step: "Evaluate release gates",
    task: "determine_if_all_formal_launch_requirements_are_green",
    script_name: "step_048_evaluate_release_gates",
    pass_condition: "release_gates_evaluated"
  },
  {
    step_no: 49,
    step_id: "STEP-049",
    phase: "Release Assessment",
    stage: "Sync",
    step: "Sync status to Airtable",
    task: "sync_blueprints_workflow_steps_statuses_and_assessments_to_airtable",
    script_name: "step_049_sync_status_to_airtable",
    pass_condition: "airtable_sync_passed"
  },
  {
    step_no: 50,
    step_id: "STEP-050",
    phase: "Release Assessment",
    stage: "Finalization",
    step: "Finalize run verdict",
    task: "close_or_continue_the_run_based_on_release_status",
    script_name: "step_050_finalize_run_verdict",
    pass_condition: "final_verdict_recorded"
  }
];
