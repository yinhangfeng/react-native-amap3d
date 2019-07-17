#import "AMapView.h"
#import "AMapCallout.h"

@interface AMapMarker : UIView

@property(nonatomic, copy) RCTBubblingEventBlock onPress;
@property(nonatomic, copy) RCTDirectEventBlock onInfoWindowPress;
@property(nonatomic, copy) RCTDirectEventBlock onDragStart;
@property(nonatomic, copy) RCTDirectEventBlock onDrag;
@property(nonatomic, copy) RCTDirectEventBlock onDragEnd;

- (MAAnnotationView *)annotationView;
- (MAPointAnnotation *)annotation;
- (void)setActive:(BOOL)active;
- (void)setMapView:(AMapView *)mapView;
- (void)lockToScreen:(int)x y:(int)y;

@end
