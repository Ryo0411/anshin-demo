const apiURL = process.env.NEXT_PUBLIC_API_URL;
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

type CreateUserType = {
  name: string;
  sex: number;
};
export async function CreateUser(request: CreateUserType) {
  const name = request.name;
  const sex = Number(request.sex);
  const del_flg = 0;
  const wanderer_flg = 0;

  try {
    const raw = JSON.stringify({
      name: name,
      sex: sex,
      del_flg: del_flg,
      wanderer_flg: wanderer_flg,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    const result = await fetch(apiURL + "/users", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        return JSON.parse(result);
      })
      .catch((error) => console.error(error));
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function CreateOnseiData(user_id: number, audio_name: string) {
  let create_at = new Date().toISOString();
  let del_flg = 0;

  try {
    const raw = JSON.stringify({
      user_id: user_id,
      audio_name: audio_name,
      create_at: create_at,
      del_flg: del_flg,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    await fetch(apiURL + "/onsei_lists", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  } catch (e) {
    throw e;
  }
}

export async function GetOnseiData(id: number) {
  try {
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/onsei_lists?user_id=" + id, requestOptions);
    const result = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function GetUser() {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/users", requestOptions);
    const result = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function PatchUser(id: number, wanderer_flg: number) {
  try {
    const raw = JSON.stringify({
      wanderer_flg: wanderer_flg,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/users/" + id, requestOptions);
    const result = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function DeleteOnseiData(id: number) {
  try {
    const raw = JSON.stringify({
      "del_flg": 1
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(apiURL + "/onsei_lists/" + id, requestOptions);
    const result = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}