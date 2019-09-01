<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonElement
import com.google.gson.JsonParseException
import com.google.gson.JsonPrimitive
import com.google.gson.JsonDeserializer
import com.google.gson.JsonSerializer
import com.google.gson.JsonDeserializationContext
import com.google.gson.JsonSerializationContext
import org.joda.time.DateTime
import java.lang.reflect.Type
import java.text.ParseException
import java.text.SimpleDateFormat
import javax.ws.rs.WebApplicationException

/**
 * Cast
 * Serialize and deserialize entities
 * @author Simpli CLI generator
 */
object Cast {

    val builder: Gson = GsonBuilder()
            .setDateFormat(Env.props.dateFormat)
            .registerTypeAdapter(DateTime::class.java, DateTimeTypeAdapter())
            .create()

    /**
     * Transform a class object to another class
     */
    fun <T> classToClass(from: Any, toType: Class<T>): T {
        val json = builder.toJson(from)
        return builder.fromJson(json, toType)
    }

    /**
     * Serialize a class object
     */
    fun classToJson(cls: Any): String {
        return builder.toJson(cls)
    }

    /**
     * Deserialize a class object
     */
    fun <T> jsonToClass(json: String, classOfT: Class<T>): T {
        return builder.fromJson(json, classOfT)
    }

    internal class DateTimeTypeAdapter : JsonSerializer<DateTime>, JsonDeserializer<DateTime> {
        private val simpleDateFormat = SimpleDateFormat(Env.props.dateFormat)

        @Throws(JsonParseException::class)
        override fun deserialize(json: JsonElement, typeOfT: Type, context: JsonDeserializationContext): DateTime {
            try {
                val date = simpleDateFormat.parse(json.asString)
                return DateTime(date)
            } catch (ex: ParseException) {
                throw WebApplicationException(ex)
            }
        }

        override fun serialize(src: DateTime, typeOfSrc: Type, context: JsonSerializationContext): JsonElement {
            val stringDate = simpleDateFormat.format(src.toDate())
            return JsonPrimitive(stringDate)
        }
    }

}
