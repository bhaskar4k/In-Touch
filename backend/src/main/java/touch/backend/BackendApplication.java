package touch.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		System.out.println("App starting...");
		SpringApplication.run(BackendApplication.class, args);
	}

}
