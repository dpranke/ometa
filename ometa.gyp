{
  'variables': {
    'v8_dir': '../v8'},
  'target_defaults': {
    'default_configuration': 'Release',
    'configurations': {
      'Release': {
        'xcode_settings': {
          'ARCHS': ['x86_64'],
          # 'CC_FLAGS': ['-g'],
          'LIBRARY_SEARCH_PATHS': ['<(v8_dir)/out/Release']}}}},
  'targets': [{
    'target_name': 'ometa',
    'type': 'executable',
    'sources': ['v8-shell.cc'],
    'include_dirs': ['<(v8_dir)/include'],
    'libraries': ['-lv8_snapshot', '-lv8_base']}]}
