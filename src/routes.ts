import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("./main/routes/_index.ts"),
  
  route("api/logout-user", "./main/routes/api.logoutUser.ts"),
  route("api/file-upload", "./main/routes/api.fileUpload.ts"),
  route("api/auth/token", "./main/routes/api.authToken.ts"),
  
  layout("./main/routes/layout.portalLayout.tsx", [
    route("my-campaigns", "./main/routes/route.myCampaigns.tsx"),
  ]),

  route("campaign/:campaignId", "./main/routes/layout.campaignLayout.tsx", [
    route("home", "./main/routes/route.campaign.home.tsx"),
    route("notifications", "./main/routes/route.campaign.notifications.tsx"),
    route("donations", "./main/routes/route.campaign.donations.tsx"),
    route("transfers", "./main/routes/route.campaign.transfers.tsx"),
    route("reports", "./main/routes/route.campaign.reports.tsx"),
    route("collaborators", "./main/routes/route.campaign.collaborators.tsx"),
    route("create-recurrence", "./main/routes/route.campaign.createRecurrence.tsx"),
    route("create-one-time-payment", "./main/routes/route.campaign.createOneTimePayment.tsx"),
    route("donors", "./main/routes/route.campaign.donors.tsx"),
    route("settings/payment-methods", "./main/routes/route.campaign.paymentMethods.tsx"),
    route("settings/general-info", "./main/routes/route.campaign.generalInfo.tsx"),
  ]),

] satisfies RouteConfig;
