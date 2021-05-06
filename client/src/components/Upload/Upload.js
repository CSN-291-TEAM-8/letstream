import React from 'react';
import './Upload.css';

const Upload = () => {
    return (
        <div className="upload">
            <div className="form-style-5">
                <form>
                    <fieldset>
                        <input type="text" name="title" placeholder="Title" />
                        <textarea name="description" placeholder="Description" />

                        <input type="button" value="Select"/>
                        <input type="submit" />
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

export default Upload;