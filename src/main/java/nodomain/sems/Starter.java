package nodomain.sems;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import nodomain.sems.deprecated.OnlyLocalhostServer;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Starter {

    public static void main(String[] args) throws IOException {
        runDeprecatedServer(args);
    }

    private static void runDeprecatedServer(String[] args) throws IOException {
        OnlyLocalhostServer.main(args);
    }

    public static Identity createApp() {
        Identity app = new Identity();
        app.text = "Sems application";
        return app;
    }

    public static Identity createApp(File file) {
        Identity app = new Identity();
        app.file = file;
        app.set("text", "Sems application (with file)");
        return app;
    }

    public static Identity loadApp(File file) {
        Identity app = new Identity();
        app.file = file;
        app.update();
        return app;
    }

    public static Identity createOnlyLocalhostServer(File file, int port) {
        Identity app = new Identity();
        app.file = file;
        app.set("text", "Sems application (with file and OnlyLocalhostServer)");
        app.set("content", List.of());
        app.set("port", port);
        return app;
    }
}
