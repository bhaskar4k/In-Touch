import '../CSS for Components/ChangeProfilePhoto.css';
import { useState } from 'react';
import React, { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.min.css';

function ChangeProfilePhoto(props) {
    //#region Global declarations
    const [selectedFiles, setSelectedFiles] = useState("Drag your files here or click in this area.");
    const [selectedImage, setSelectedImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [displayCroppedImage, setDisplayCroppedImage] = useState(false);
    const cropperRef = useRef(null);
    //#endregion


    //#region Cropperjs logic to crop the uploaded image
    const handleImageChange = (event) => {
        const fileInput = document.getElementById('imageInput');
        const file = fileInput.files[0];
        setSelectedFiles(file.name + " has been selected");
        document.getElementById("imageUpload").style.display = "none";

        setCroppedImage(null);
        setDisplayCroppedImage(false);
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
                document.getElementById("crop_image_button").style.display = "block";
            };
            reader.onerror = (error) => {
                console.error('Error reading image:', error);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleCrop = () => {
        if (cropperRef.current) {
            const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
                width: 600,
                height: 600,
            });
            if (croppedCanvas) {
                croppedCanvas.toBlob((blob) => {
                    const croppedImageUrl = URL.createObjectURL(blob);
                    setSelectedImage(null);
                    setCroppedImage(croppedImageUrl);
                    setDisplayCroppedImage(true);
                    document.getElementById("push_cropped_image_into_DB_button").style.display = "block";
                });
            }
        }
        document.getElementById("crop_image_button").style.display = "none";
    };
    //#endregion


    //#region Push the cropped image into database
    async function push_cropped_image_into_DB() {
        const file = document.getElementById('output');
        const imageUrl = file.src;

        // Load the image
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append('image', blob);
        formData.append('user_name', props.requested_username);

        try {
            const response = await fetch('http://localhost:8080/change_profile_photo', {
                method: 'POST',
                body: formData
            })

            window.location.reload();
        } catch {
            console.log("0", "Internal server error");
        }

        document.getElementById("crop_image_button").style.display = "none";
        document.getElementById("push_cropped_image_into_DB_button").style.display = "none";
    }
    //#endregion

    return (
        <>
            <div className='change_profile_photo_container'>
                <p className='selected_file_name'>{selectedFiles}</p>
                <form id="imageUpload">
                    <input type="file" accept="image/*" id="imageInput" onChange={handleImageChange} />
                </form>

                {selectedImage && (
                    <Cropper
                        ref={cropperRef}
                        src={selectedImage}
                        aspectRatio={1 / 1}
                        guides={false}
                        viewMode={1}
                        cropmove={true}
                        cropend={(data) => console.log('Crop data:', data)}
                        className='cropping_image'
                    />
                )}

                {displayCroppedImage && <img src={croppedImage} alt="" id="output" />}

                <div className='change_profile_photo_control_btns'>
                    <button id="crop_image_button" onClick={handleCrop}>Crop Image</button>
                    <button id="push_cropped_image_into_DB_button" onClick={push_cropped_image_into_DB}>Change profile photo</button>
                </div>
            </div>
        </>
    );
}

export default ChangeProfilePhoto;
