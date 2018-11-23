require 'json'

package = JSON.parse(File.read(File.join(__dir__, '../../package.json')))

Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']

  s.authors      = { "Qiu Xiang" => "i@7c00.cc" }
  s.homepage     = package['repository']['url']
  s.license      = package['license']
  s.platform     = :ios, "8.0"

  s.source       = { :git => package['repository']['url'] }
  s.source_files = '**/*.{h,m}'

  s.dependency 'React'
  s.dependency 'AMapNavi-NO-IDFA'

  # 强行设置react-native-amap3d在运行时动态查找符号
  # https://github.com/qiuxiang/react-native-amap3d/issues/370
  s.pod_target_xcconfig = {
    'OTHER_LDFLAGS' => '$(inherited) -undefined dynamic_lookup'
  }
  s.pod_target_xcconfig  = { 'ENABLE_BITCODE' => 'NO' }
end
