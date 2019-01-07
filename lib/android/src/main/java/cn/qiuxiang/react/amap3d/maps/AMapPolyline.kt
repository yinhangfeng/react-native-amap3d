package cn.qiuxiang.react.amap3d.maps

import android.content.Context
import android.graphics.Color
import cn.qiuxiang.react.amap3d.toLatLngList
import com.amap.api.maps.AMap
import com.amap.api.maps.model.LatLng
import com.amap.api.maps.model.Polyline
import com.amap.api.maps.model.PolylineOptions
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.views.view.ReactViewGroup

class AMapPolyline(context: Context) : ReactViewGroup(context), AMapOverlay {
    var polyline: Polyline? = null
        private set

    private var coordinates: ArrayList<LatLng> = ArrayList()
    private var colors: ArrayList<Int> = ArrayList()

    var width: Float = 1f
        set(value) {
            field = value
            polyline?.width = value
        }

    var color: Int = Color.BLACK
        set(value) {
            field = value
            polyline?.color = value
        }

    var zIndex: Float = 0f
        set(value) {
            field = value
            polyline?.zIndex = value
        }

    var geodesic: Boolean = false
        set(value) {
            field = value
            polyline?.isGeodesic = value
        }

    var dashed: Boolean = false
        set(value) {
            field = value
            polyline?.isDottedLine = value
        }

    var dashType: Int = 0
        set(value) {
            field = value
            if (polyline != null) {
                polyline?.options?.dottedLineType = if (dashType == 1) PolylineOptions.DOTTEDLINE_TYPE_CIRCLE else PolylineOptions.DOTTEDLINE_TYPE_CIRCLE
            }
        }

    var gradient: Boolean = false

    fun setCoordinates(coordinates: ReadableArray) {
        this.coordinates = coordinates.toLatLngList()
        polyline?.points = this.coordinates
    }

    fun setColors(colors: ReadableArray) {
        this.colors = ArrayList((0 until colors.size()).map { colors.getInt(it) })
    }

    override fun add(map: AMap) {
        polyline = map.addPolyline(PolylineOptions()
                .addAll(coordinates)
                .color(color)
                .colorValues(colors)
                .width(width)
                .useGradient(gradient)
                .geodesic(geodesic)
                .setDottedLine(dashed || dashType > 0)
                .setDottedLineType(if (dashType == 1) PolylineOptions.DOTTEDLINE_TYPE_SQUARE else PolylineOptions.DOTTEDLINE_TYPE_CIRCLE)
                .zIndex(zIndex))
    }

    override fun remove() {
        polyline?.remove()
    }
}
