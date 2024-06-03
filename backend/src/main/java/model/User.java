package model;

import com.fasterxml.jackson.annotation.JsonCreator;

public class User {
	private String user_name, birthdate, gender, phone, email, password, bio;
	
	@JsonCreator
	public User(String user_name, String birthdate, String gender, String phone, String email, String password) {
		this.user_name=user_name;
		this.birthdate=birthdate;
		this.gender=gender;
		this.phone=phone;
		this.email=email;
		this.password=password;
	}
	
	public User(String user_name, String birthdate, String gender, String phone, String email, String password, String bio) {
		this.user_name=user_name;
		this.birthdate=birthdate;
		this.gender=gender;
		this.phone=phone;
		this.email=email;
		this.password=password;
		this.bio=bio;
	}
	
	public User(String email, String password) {
		this.email=email;
		this.password=password;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public String getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(String birthdate) {
		this.birthdate = birthdate;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public void print() {
		System.out.println("[user_name=" + user_name + ", birthdate=" + birthdate + ", gender=" + gender
				 + ", phone=" + phone + ", email=" + email + ", password=" + password + "]");
	}
}
