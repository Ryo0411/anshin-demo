const apiURL = process.env.NEXT_PUBLIC_ANIMOAPI_URL;

export async function AddAudio(id: number, fileUrl: string) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "audio/wav");
    // Blob URLからBlobを取得
    const response_url = await fetch(fileUrl);
    console.log(response_url);
    const audioBlob = await response_url.blob();
    console.log(audioBlob);

    // POSTリクエストオプションの設定（Content-Typeヘッダーは指定しない）
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: audioBlob,
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/audio/add/" + id, requestOptions);
    const result = await response.json();
    console.log(result)
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function RemoveAudio(id: number, audio_name: string) {
  try {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/audio/remove/" + id + "/" + audio_name, requestOptions);
    const result = await response.text();
    console.log(result)
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function updateWavScp(id: number) {
  try {
    const requestOptions = {
      method: "POST",
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/add/wanderer/" + id, requestOptions);
    const result = await response.text();
    console.log(result)
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function removeWavScp(id: number) {
  try {
    const requestOptions = {
      method: "POST",
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/remove/wanderer/" + id, requestOptions);
    const result = await response.text();
    console.log(result)
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function getFindAudio(id: number) {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/audio/" + id, requestOptions);
    const result = await response.json();
    console.log(result)
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function handleSendFile(id: number, audio_name: string) {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/audio/wav/" + id + "/" + audio_name, requestOptions);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function enrollAudio() {
  try {
    // myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      // headers: myHeaders,
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/audio/enroll", requestOptions);
    const result = await response.text();
    console.log(result)
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export async function identifyAudio(fileUrl: string) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "audio/wav");
    // Blob URLからBlobを取得
    const response_url = await fetch(fileUrl);
    const audioBlob = await response_url.blob();

    // POSTリクエストオプションの設定（Content-Typeヘッダーは指定しない）
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: audioBlob,
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/audio/identify", requestOptions);
    const result = await response.json();
    console.log(result)
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}