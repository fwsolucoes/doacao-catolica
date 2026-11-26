import { useEffect, useRef, useState } from "react";
import { useRoot } from "~/client/hooks/useRoot";

type IpApiResponse = {
  ip?: string;
  latitude?: number;
  longitude?: number;
};

function useIp() {
  const accessKey = useRoot().environmentVariables?.IPAPI_ACCESS_KEY;
  const [ip, setIp] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current || !accessKey) return;
    hasFetched.current = true;

    fetch(`https://api.ipapi.com/api/check?access_key=${accessKey}`)
      .then((response) => response.json())
      .then((data: IpApiResponse) => {
        setIp(data.ip ?? "");
        setLat(data.latitude !== undefined ? String(data.latitude) : "");
        setLng(data.longitude !== undefined ? String(data.longitude) : "");
      })
      .catch(() => {
        setIp("");
        setLat("");
        setLng("");
      })
      .finally(() => setLoading(false));
  }, [accessKey]);

  return { ip, lat, lng, loading };
}

export { useIp };
