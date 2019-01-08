import React, { Children } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  requireNativeComponent,
  StyleSheet,
  ViewPropTypes,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { LatLng, Point } from '../PropTypes';
import Component from '../Component';
import Callout from './Callout';
import InfoWindow from './InfoWindow';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
  },
  callout: {
    position: 'absolute',
    paddingTop: '60%',
  },
});

const AMapMarker = requireNativeComponent('AMapMarker');

export default class Marker extends Component {
  static propTypes = {
    ...ViewPropTypes,

    /**
     * 坐标
     */
    coordinate: LatLng.isRequired,

    /**
     * 标题，作为默认的选中弹出显示
     */
    title: PropTypes.string,

    /**
     * 描述，显示在标题下方
     */
    description: PropTypes.string,

    /**
     * 默认图标颜色
     */
    color: Platform.select({
      android: PropTypes.oneOf([
        'azure',
        'blue',
        'cyan',
        'green',
        'magenta',
        'orange',
        'red',
        'rose',
        'violet',
        'yellow',
      ]),
      ios: PropTypes.oneOf(['red', 'green', 'purple']),
    }),

    /**
     * 自定义图标
     */
    icon: PropTypes.func,

    /**
     * 自定义图片，对应原生图片名称
     */
    image: PropTypes.string,

    /**
     * 透明度 [0, 1]
     */
    opacity: PropTypes.number,

    /**
     * 是否可拖拽
     */
    draggable: PropTypes.bool,

    /**
     * 是否平贴地图
     */
    flat: PropTypes.bool,

    /**
     * 层级
     */
    zIndex: PropTypes.number,

    /**
     * 覆盖物锚点比例
     *
     * @link http://a.amap.com/lbs/static/unzip/Android_Map_Doc/3D/com/amap/api/maps/model/Marker.html#setAnchor-float-float-
     * @platform android
     */
    anchor: Point,

    /**
     * 覆盖物偏移位置
     *
     * @link http://a.amap.com/lbs/static/unzip/iOS_Map_Doc/AMap_iOS_API_Doc_3D/interface_m_a_annotation_view.html#a78f23c1e6a6d92faf12a00877ac278a7
     * @platform ios
     */
    centerOffset: Point,

    /**
     * 是否选中，选中时将显示信息窗体，一个地图只能有一个正在选中的 marker
     */
    active: PropTypes.bool,

    /**
     * 是否禁用点击，默认不禁用
     */
    clickDisabled: PropTypes.bool,

    /**
     * 是否禁用弹出窗口，默认不禁用
     */
    infoWindowDisabled: PropTypes.bool,

    /**
     * 点击事件
     */
    onPress: PropTypes.func,

    /**
     * 拖放开始事件
     */
    onDragStart: PropTypes.func,

    /**
     * 拖放进行事件，类似于 mousemove，在结束之前会不断调用
     */
    onDrag: PropTypes.func,

    /**
     * 拖放结束事件，最终坐标将传入参数
     */
    onDragEnd: PropTypes.func,

    /**
     * 信息窗体点击事件
     *
     * 注意，对于自定义信息窗体，该事件是无效的
     */
    onInfoWindowPress: PropTypes.func,
  };

  constructor(props) {
    super(props);
    if (Platform.OS === 'ios') {
      this.state = {
        activeIOS: false,
      };
    }
  }

  componentDidUpdate() {
    if (this.customMarker && Platform.OS === 'android') {
      setTimeout(() => this.sendCommand('update'), 0);
    }
  }

  name = 'AMapMarker';

  active() {
    this.sendCommand('active');
  }

  lockToScreen(x, y) {
    this.sendCommand('lockToScreen', [x, y]);
  }

  _setActiveIOS(active) {
    this.setState({
      activeIOS: active,
    });
    this.active();
  }

  _onPress = e => {
    console.log('marker onPress', e.nativeEvent);
    const {
      _mapView,
      onPress,
    } = this.props;
    if (!this.state.activeIOS) {
      _mapView._setActiveMarkerIOS(this);
    }
    onPress && onPress(e);
  };

  _onMarkerLayout = (event) => {
    console.log('_onMarkerLayout', event.nativeEvent);
    const { height } = event.nativeEvent.layout;
    if (this._markerHeight === height) {
      return;
    }
    this._markerHeight = height;
    if (this.state.activeIOS) {
      this.forceUpdate();
    }
  };

  render() {
    const { icon, children, ...otherProps } = this.props;
    let customMarker;
    let callout;

    if (icon) {
      this.customMarker = true;
      customMarker = <View style={styles.overlay}>{icon()}</View>;
      if (children) {
        callout = <InfoWindow style={styles.overlay}>{children}</InfoWindow>;
      }
    } else {
      // 兼容 react-native-maps

      Children.forEach(children, child => {
        if (!child) {
          return;
        }

        if (child.type === Callout) {
          if (callout) {
            if (__DEV__) {
              throw new Error('Marker 只能有一个 callout');
            }
            return;
          }
          callout = child;
          return;
        }

        if (customMarker) {
          if (__DEV__) {
            throw new Error('Marker 只能有一个自定义 View');
          }
          return;
        }
        this.customMarker = true;
        customMarker = child;
      });

      if (Platform.OS === 'ios' && customMarker) {
        let anchorX = 0.5;
        let anchorY = 1;
        const anchor = otherProps.anchor;
        if (anchor) {
          anchorX = anchor.x;
          anchorY = anchor.y;
        }
        customMarker = (
          <View pointerEvents="box-none" onLayout={this._onMarkerLayout} style={{ position: 'absolute', padding: 32, backgroundColor: 'green'}}>
            <TouchableWithoutFeedback onPress={this._onPress}>
              <View style={{
                left: `${(0.5 - anchorX) * 100}%`,
                top: `${(0.5 - anchorY) * 100}%`,
                backgroundColor: 'blue',
              }}>
                {customMarker}
              </View>
            </TouchableWithoutFeedback>
          </View>
        );

        // callout = undefined;
        otherProps.infoWindowDisabled = !!callout;
        otherProps.onPress = undefined;

        const acitve = otherProps.acitve || this.state.activeIOS;
        let calloutMarker;
        if (acitve && callout && this._markerHeight) {
          // marker 包含 padding 所以需要减去 32 * 2
          const offset = (this._markerHeight - 64) * anchorY;

          console.log('callout offset', offset)

          const {
            coordinate,
          } = otherProps;
          calloutMarker = (
            <AMapMarker coordinate={coordinate} zIndex={99999} infoWindowDisabled>
              <View pointerEvents="box-none" style={{ position: 'absolute', backgroundColor: 'rgba(255,200,200,0.3)'}}>
                <View
                  pointerEvents="box-none"
                  style={{
                    paddingTop: 300,
                    bottom: '50%',
                    paddingBottom: offset,
                  }}
                >
                  {callout}
                </View>
              </View>
            </AMapMarker>
          );
        }

        return (
          <>
            <AMapMarker {...otherProps}>
              {customMarker}
            </AMapMarker>
            {calloutMarker}
          </>
        );
      } else {
        if (callout) {
          callout = React.cloneElement(callout, {
            style: styles.overlay,
          });
        }
  
        if (customMarker) {
          customMarker = <View style={styles.overlay}>{customMarker}</View>;
        }
      }
    }

    return (
      <AMapMarker {...otherProps}>
        {customMarker}
        {callout}
      </AMapMarker>
    );
  }
}
