// For getting timestamp and connecting to the server

import { toast } from "react-toastify";
import axios from "axios";


export const timeSince = (timestamp, short) => {


    //just pass createdAt data of any video to it as timestamp
    // suppose if video was posted 2 days ago
    //u will get `2 days` as output otherwise `2d` if short is true

    // timeSince(1414515115,true) => 4y
    // timeSince(14526262626,false) => 2 years

    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

    let interval = Math.floor(seconds / 31536000); //make into year

    if (interval > 1) {
        return !short ? interval + " years" : interval + "y";
    }

    interval = Math.floor(seconds / 604800); //make into months
    if (interval > 1) {
        return !short ? interval + " weeks" : interval + "w";
    }

    interval = Math.floor(seconds / 86400); //make into days
    if (interval > 1) {
        return !short ? interval + " days" : interval + "d";
    }

    interval = Math.floor(seconds / 3600);//make into hours
    if (interval > 1) {
        return !short ? interval + " hours" : interval + "h";
    }

    interval = Math.floor(seconds / 60);//make into minutes

    if (interval > 1) {
        return !short ? interval + " minutes" : interval + "m";
    }
    if (short)
        return Math.floor(seconds) > 0 ? Math.floor(seconds) + "s" : "1s";
    return Math.floor(seconds) > 5 ? Math.floor(seconds) + " seconds" : "few seconds";//else finally second
};
//make request to server for fetching data
export const Connect = (endpoint, { body, ...customConfig } = {}) => {
    const token = localStorage.getItem("accesstoken");
    const headers = { "Content-Type": "application/json" };
    

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        method: body ? "POST" : "GET",
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }
    //http://localhost:5000
    return fetch(window.location.hostname === "localhost" ? "http://localhost:5000/api/v1"+endpoint : "https://letstreamiitr.herokuapp.com/api/v1"+endpoint, config).then(
        async (res) => {
            const data = await res.json();

            if (res.ok) {
                
                console.log(data);
                if (data.unseennotice && data.unseennotice > 0) {
                    if (document.getElementById('noti-count')) {
                        document.getElementById('noti-count').textContent = data.unseennotice;
                        document.getElementById('noti-wrapper').style.display = 'flex';
                    }
                    if (document.getElementById('noti-count-mobile')) {
                        document.getElementById('noti-count-mobile').textContent = data.unseennotice;
                        document.getElementById('noti-wrapper-mobile').style.display = 'flex';
                    }
                }
                else {
                    if (document.getElementById('noti-wrapper')) {
                        document.getElementById('noti-wrapper').style.display = 'none';
                        if (document.getElementById('noti-wrapper-mobile'))
                            document.getElementById('noti-wrapper-mobile').style.display = 'none';
                    }
                }
                if (data.unseenmsg && data.unseenmsg > 0) {
                    if (document.getElementById('inb-count')) {
                        document.getElementById('inb-count').textContent = data.unseenmsg;
                        document.getElementById('inb-wrapper').style.display = 'flex';
                    }
                    if (document.getElementById('inb-count-mobile')) {
                        document.getElementById('inb-count-mobile').textContent = data.unseenmsg;
                        document.getElementById('inb-wrapper-mobile').style.display = 'flex';
                    }
                }
                else {
                    if (document.getElementById('inb-wrapper'))
                        document.getElementById('inb-wrapper').style.display = 'none';
                    if (document.getElementById('inb-wrapper-mobile'))
                        document.getElementById('inb-wrapper-mobile').style.display = 'none';
                }
                return data;
            } else {
                
                //console.log(data);
                if (data.logout) {
                    localStorage.clear();   
                    alert("Action failed...Your token may be expired or reset or malformed");
                    window.location.reload();
                }
                return Promise.reject(data);
            }
        }
    )
};

export const uploadImage = async ({ username }, file) => {

    if (username === "Guestiitr") {
        return Promise.reject({ message: "You are not allowed to modify the detail" });
    }

    const fdata = new FormData();
    console.log("size--->", file.size, "bytes");
    fdata.append("file", file);
    fdata.append("upload_preset", "letstreamiitrmedia");//may be profile image
    let toastIdav = null;

    const config = {
        onUploadProgress: (p) => {
            const progress = p.loaded / p.total;
            if (toastIdav === null) {
                toastIdav = toast("Uploading...", {
                    progress,
                });
            } else {
                toast.update(toastIdav, {
                    progress,
                });
            }
        },
    };

    const {data} = await axios.post(//
        `${process.env.REACT_APP_UPLOAD_MEDIA_URI}/image/upload`,
        fdata,
        config
    );

    toast.dismiss(toastIdav);
    console.log(data);
    return data.secure_url;
};

export const uploadMediaFile = async (filetype, file) => {

    
    const fdata = new FormData();
    console.log("size--->", file.size, "bytes");
    fdata.append("file", file);
    fdata.append("upload_preset", "letstreamiitrmedia");
    let toastId = null;

    const config = {
        onUploadProgress: (p) => {
            const progress = p.loaded / p.total;
            if (toastId === null) {
                toastId = toast("Uploading...", {
                    progress,
                });
            } else {
                toast.update(toastId, {
                    progress,
                });
            }
        },
    };

    const {data} = await axios.post(//
        `${process.env.REACT_APP_UPLOAD_MEDIA_URI}/${filetype}/upload`,
        fdata,
        config
    );

    toast.dismiss(toastId);
    console.log(data);
    return data.secure_url;//use da.data.secure_url
    // return fetch("https://api.cloudinary.com/v1_1/dv9k3us3f/" + filetype + "/upload", {
    //     method: "POST",
    //     body: data,
    // }).then((res) => res.json());
};

export const uploadChatFile = async (filetype, file) => {
    const data = new FormData();
    console.log("size--->", file.size, "bytes");
    data.append("file", file);
    data.append("upload_preset", "letstreamiitrchat");
    let toastId = null;

    const config = {
        onUploadProgress: (p) => {
            const progress = p.loaded / p.total;
            if (toastId === null) {
                toastId = toast("Upload in Progress", {
                    progress,
                });
            } else {
                toast.update(toastId, {
                    progress,
                });
            }
        },
    };

    const d =  axios.post(
        `${process.env.REACT_APP_UPLOAD_CHAT_URI}/${filetype}/upload`,
        data,
        config
    );

    toast.dismiss(toastId);

    return d;
    // return fetch("https://api.cloudinary.com/v1_1/dv9k3us3f/" + filetype + "/upload", {
    //     method: "POST",
    //     body: data,
    // }).then((res) => res.json());
};
export default Connect;