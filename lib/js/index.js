import MapView from "./maps/MapView";
import Marker from "./maps/Marker";
import Polyline from "./maps/Polyline";
import Polygon from "./maps/Polygon";
import Circle from "./maps/Circle";
import HeatMap from "./maps/HeatMap";
import MultiPoint from "./maps/MultiPoint";
import Offline from "./Offline";
import Callout from './maps/Callout';

MapView.Marker = Marker;
MapView.Polyline = Polyline;
MapView.Polygon = Polygon;
MapView.Circle = Circle;
MapView.HeatMap = HeatMap;
MapView.MultiPoint = MultiPoint;
MapView.Callout = Callout;

export default MapView;
export { MapView, Marker, Polyline, Polygon, Circle, HeatMap, MultiPoint, Offline, Callout };
