import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("./main/routes/_index.ts"),
  
  route("api/logout-user", "./main/routes/api.logoutUser.ts"),
  route("api/file-upload", "./main/routes/api.fileUpload.ts"),
  route("api/auth/token", "./main/routes/api.authToken.ts"),
  
  layout("./main/routes/layout.pendingInvitesLayout.tsx", [ 
    route("pending-invites/:token", "./main/routes/route.pendingInvites.tsx"),
  ]),

  route("workspaces/:workspaceId", "./main/routes/layout.workspaceLayout.tsx", [
    route("home", "./main/routes/route.workspace.home.tsx"),
    route("collaborators", "./main/routes/route.collaborators.tsx", [
      index("./main/routes/activeCollaborators.tsx"),
      route("pending", "./main/routes/pendingCollaborators.tsx"),
    ]),
    route("patients", "./main/routes/route.patients.tsx"),
    route("patients/create", "./main/routes/route.patientCreate.tsx"),
    route("patients/:patientId", "./main/routes/route.patientUpdate.tsx"),
  ]),
  
  layout("./main/routes/layout.appLayout.tsx", [
    route("my-campaigns", "./main/routes/route.myCampaigns.tsx"),
  ]),

  route("campaign/:campaignId", "./main/routes/layout.campaignLayout.tsx", [
    route("home", "./main/routes/route.campaign.home.tsx"),
    route("notifications", "./main/routes/route.campaign.notifications.tsx"),
    route("donations", "./main/routes/route.campaign.paymentStatements.tsx"),
    route("create-recurrence", "./main/routes/route.campaign.createRecurrence.tsx"),
    route("create-one-time-payment", "./main/routes/route.campaign.createOneTimePayment.tsx"),
    route("settings/payment-methods", "./main/routes/route.campaign.paymentMethods.tsx"),
  ]),

  route("treatment/:treatmentId", "./main/routes/layout.treatmentLayout.tsx", [
    route("home", "./main/routes/route.treatment.home.tsx"),
    route("medications", "./main/routes/route.medications.tsx"),
    route("health-trackers", "./main/routes/route.healthTrackers.tsx"),
  ]),
] satisfies RouteConfig;