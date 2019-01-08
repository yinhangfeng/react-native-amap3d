//
//  AMapCustomAnnotationView.m
//  react-native-amap3d
//
//  Created by yinhf on 2019/1/8.
//

#import "AMapCustomAnnotationView.h"

@implementation AMapCustomAnnotationView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (void)setAnchor:(CGPoint)anchor {
    _anchor = anchor;
    [self updateCenterOffset];
}

- (void)setBounds:(CGRect)bounds {
    [super setBounds:bounds];
    [self updateCenterOffset];
}

- (void) updateCenterOffset {
    if (!self.bounds.size.width || !self.bounds.size.height) {
        return;
    }
    
    self.centerOffset = CGPointMake((0.5 - _anchor.x) * self.bounds.size.width, (0.5 - _anchor.y) * self.bounds.size.height);
}

@end
