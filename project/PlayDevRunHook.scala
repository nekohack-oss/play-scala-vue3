import java.io.File
import java.net.InetSocketAddress

import com.typesafe.config._
import play.sbt.PlayRunHook
import sbt._

object PlayDevRunHook {
  def apply(base: File): PlayRunHook = {
    object WebpackServerScript extends PlayRunHook {
      var process: Option[Process] = None
      val isWin: Boolean = System.getProperty("os.name").toUpperCase().indexOf("WIN") >= 0
      val config: Config = ConfigFactory.parseFile(new File("conf/application.conf")).resolve()
      val npmCommand: String = config.getString("npm.command")
      override def afterStarted(add: InetSocketAddress): Unit = {
        process = if (isWin)
          Option(Process(s"cmd /c $npmCommand run serve", base).run)
        else
          Option(Process(s"""$npmCommand run serve""", base).run)
      }
      override def afterStopped(): Unit = {
        process.foreach(p => { p.destroy() })
        process = None
      }
    }

    WebpackServerScript
  }
}
