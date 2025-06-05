import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const loadVideoById = (id, callback) => {
    const dbRequest = indexedDB.open('videoDB', 1);

    dbRequest.onsuccess = () => {
        const db = dbRequest.result;
        const tx = db.transaction('videos', 'readonly');
        const store = tx.objectStore('videos');
        const getRequest = store.get(id);

        getRequest.onsuccess = () => {
            const record = getRequest.result;
            if (record) {
                const videoURL = URL.createObjectURL(record.blob);
                callback(videoURL, record.metadata);
            } else {
                console.warn('No video found with ID:', id);
            }
        };
    };
}

export const saveVideoFromUrl = async (id, url, metadata) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const dbRequest = indexedDB.open('videoDB', 1);

    dbRequest.onupgradeneeded = () => {
        dbRequest.result.createObjectStore('videos', { keyPath: 'id' });
    };

    dbRequest.onsuccess = () => {
        const db = dbRequest.result;
        const tx = db.transaction('videos', 'readwrite');
        const store = tx.objectStore('videos');
        store.put({ id, blob, metadata });
        tx.oncomplete = () => {
            console.log(`Video "${id}" saved with metadata`);
            toast(
                <Link className="text-decoration-none text-secondary" to={`/downloads/${metadata._id}`}>
                    <div style={{ color: "blue", fontWeight: "bold" }}>
                        <div className="row d-flex align-items-center">
                            <div className="col-3">
                                <img className="rounded-circle w-100" src={metadata.author.profilePic} alt="connect" />
                            </div>

                            <div className="col-9">
                                {metadata?.caption && (<h3 className="text-success mb-0">{metadata.caption}</h3>)}
                                <p className="text-small text-secondary text-muted mb-0">{`${metadata.caption} Saved to videos`}</p>
                            </div>
                        </div>
                    </div>
                </Link>)
        };
    };
}

export const getAllSavedVideos = (callback) => {
  const dbRequest = indexedDB.open('videoDB', 1);

  dbRequest.onsuccess = () => {
    const db = dbRequest.result;
    const tx = db.transaction('videos', 'readonly');
    const store = tx.objectStore('videos');

    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
      const videos = getAllRequest.result.map((video) => ({
        id: video.id,
        metadata: video.metadata,
        videoURL: URL.createObjectURL(video.blob), // this is what <video src=...> needs
      }));

      callback(videos);
    };

    getAllRequest.onerror = () => {
      console.error('Failed to fetch videos from IndexedDB');
      callback([]);
    };
  };

  dbRequest.onerror = () => {
    console.error('Failed to open IndexedDB');
    callback([]);
  };
};

export const deleteVideoById = (id, callback) => {
    const dbRequest = indexedDB.open('videoDB', 1);

    dbRequest.onsuccess = () => {
        const db = dbRequest.result;
        const tx = db.transaction('videos', 'readwrite');
        const store = tx.objectStore('videos');

        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = () => {
            console.log(`Video with id "${id}" deleted`);
            if (callback) callback(true);
        };

        deleteRequest.onerror = () => {
            console.error(`Failed to delete video with id "${id}"`);
            if (callback) callback(false);
        };
    };

    dbRequest.onerror = () => {
        console.error('Failed to open IndexedDB');
        if (callback) callback(false);
    };
}