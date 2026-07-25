import { useFetcher } from "react-router";
import { Switch } from "~/client/components/ui/switch";
import { useActionToast } from "~/client/hooks/useActionToast";

type Props = {
  uuid: string;
  active: boolean;
};

function NotificationSettingSwitch({ uuid, active }: Props) {
  const fetcher = useFetcher();

  useActionToast(fetcher.data);

  const optimisticActive =
    fetcher.formData ? fetcher.formData.get("active") === "true" : active;

  function handleChange(checked: boolean) {
    const formData = new FormData();
    formData.set("uuid", uuid);
    formData.set("active", checked.toString());
    formData.set("_action", "toggleNotificationSetting");
    fetcher.submit(formData, { method: "post" });
  }

  return (
    <Switch
      checked={optimisticActive}
      disabled={fetcher.state !== "idle"}
      onCheckedChange={handleChange}
    />
  );
}

export { NotificationSettingSwitch };
