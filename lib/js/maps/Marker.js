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
     * ios 对 customView 有效
     */
    anchor: Point,

    /**
     * 覆盖物偏移位置
     *
     * @link http://a.amap.com/lbs/static/unzip/iOS_Map_Doc/AMap_iOS_API_Doc_3D/interface_m_a_annotation_view.html#a78f23c1e6a6d92faf12a00877ac278a7
     * @platform ios 对 customView 无效
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
        activeIOS: undefined,
      };
    }
  }

  componentDidMount() {
    if (Platform.OS === 'ios' && this.props.active && !this.props._mapView._activeMarker) {
      this.props._mapView._activeMarker = this;
    }
  }

  componentDidUpdate(prevProps) {
    if (this.hasCustomMarker && Platform.OS === 'android') {
      setTimeout(() => this.sendCommand('update'), 0);
    }
    if (Platform.OS === 'ios') {
      const {
        active,
        _mapView,
      } = this.props;
      if (!prevProps.active && active && this.state.activeIOS == null && !_mapView._activeMarker) {
        _mapView._activeMarker = this;
      }
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios' && this.props._mapView._activeMarker === this) {
      this.props._mapView._activeMarker = null;
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
    if (active) {
      this.active();
    }
  }

  _onPress = e => {
    // console.log('marker onPress', e.nativeEvent);
    const { _mapView, onPress } = this.props;
    if (!this.state.activeIOS) {
      _mapView._setActiveMarkerIOS(this);
    }
    onPress && onPress(e);
  };

  _onCalloutPress = e => {
    // console.log('_onCalloutPress', e.nativeEvent);
    this.props._mapView._setActiveMarkerIOS(null);
  };

  _onMarkerLayout = event => {
    // console.log('_onMarkerLayout', event.nativeEvent);
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
      this.hasCustomMarker = true;
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
        this.hasCustomMarker = true;
        customMarker = child;
      });

      if (Platform.OS === 'ios' && customMarker) {
        // ios 用 Marker 实现 callout
        if (callout) {
          otherProps.infoWindowDisabled = true;
        }
        otherProps.onPress = undefined;
        // 使用 TouchableWithoutFeedback 实现 marker onPress
        // Marker 的 onPress 点击地图其它地方也会触发?
        const marker = (
          <AMapMarker {...otherProps}>
            <TouchableWithoutFeedback onLayout={this._onMarkerLayout} onPress={this._onPress}>
              <View style={styles.overlay}>{customMarker}</View>
            </TouchableWithoutFeedback>
          </AMapMarker>
        );

        // 用 Marker 实现 callout
        // TODO callout 下部的空白区域点击会使 callout marker active
        const active = this.state.activeIOS == null ? otherProps.active : this.state.activeIOS;
        // console.log('otherProps.active', otherProps.active, 'this.state.activeIOS', this.state.activeIOS, active, otherProps.coordinate);
        let calloutMarker;
        if (active && callout && this._markerHeight) {
          const anchorY = otherProps.anchor ? otherProps.anchor.y : 1;
          const { coordinate } = otherProps;
          calloutMarker = (
            <AMapMarker coordinate={coordinate} zIndex={99999} infoWindowDisabled>
              <TouchableWithoutFeedback onPress={this._onCalloutPress}>
                <View
                  style={{
                    position: 'absolute',
                    paddingBottom: this._markerHeight * anchorY,
                  }}
                >
                  <TouchableWithoutFeedback>
                    {callout}
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </AMapMarker>
          );
        }

        return (
          <>
            {marker}
            {calloutMarker}
          </>
        );
      }
      
      if (callout) {
        callout = React.cloneElement(callout, {
          style: styles.overlay,
        });
      }

      if (customMarker) {
        customMarker = <View style={styles.overlay}>{customMarker}</View>;
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
