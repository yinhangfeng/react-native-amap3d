// @flow
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  ColorPropType,
  Platform,
  processColor,
  requireNativeComponent,
  ViewPropTypes
} from "react-native";
import { LatLng } from "../PropTypes";

export default class Polyline extends PureComponent {
  static propTypes = {
    ...ViewPropTypes,

    /**
     * 节点坐标
     */
    coordinates: PropTypes.arrayOf(LatLng).isRequired,

    /**
     * 线段宽度
     */
    width: PropTypes.number,

    /**
     * 线段颜色
     */
    color: ColorPropType,

    /**
     * 层级
     */
    zIndex: PropTypes.number,

    /**
     * 多段颜色
     */
    colors: PropTypes.arrayOf(ColorPropType),

    /**
     * 是否使用颜色渐变
     */
    gradient: PropTypes.bool,

    /**
     * 是否绘制大地线
     */
    geodesic: PropTypes.bool,

    /**
     * 是否绘制虚线
     */
    dashed: PropTypes.bool,

    /**
     * 虚线类型 0: 直线 1: 方块 2: 圆点
     */
    dashType: PropTypes.number,

    /**
     * 点击事件
     */
    onPress: PropTypes.func
  };

  static defaultProps = {
    colors: []
  };

  render() {
    const props = {
      ...this.props,
    };

    // react-native-maps
    if (props.strokeWidth != null) {
      props.width = props.strokeWidth;
    }
    if (props.strokeColor != null) {
      props.color = props.strokeColor;
    }
    if (props.strokeColors != null) {
      props.colors = props.strokeColors;
    }
    if (Platform.OS === 'android' && props.colors.length) {
      props.colors = props.colors.map(processColor);
    }

    return <AMapPolyline {...props} />;
  }
}

const AMapPolyline = requireNativeComponent("AMapPolyline", Polyline);
