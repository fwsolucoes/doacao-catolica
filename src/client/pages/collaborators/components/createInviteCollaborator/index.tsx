import {
  Button,
  FormProvider,
  Input,
  ModalContainer,
  ModalFooter,
  ModalHeader,
  RadioBox,
  RadioGroup,
  Select,
  useModal,
} from "@arkyn/components";
import { useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useParams,
} from "react-router";

import { Check } from "lucide-react";
import { AvatarUploadArea } from "~/client/components/avatarUploadArea";
import { useFilter } from "~/client/hooks/useFilter";
import { useRoot } from "~/client/hooks/useRoot";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import { ModalContent } from "./styles";

function CreateInviteCollaborator() {
  const { modalIsOpen, closeModal } = useModal("invite-collaborator");
  const { roles, activityAreas, specialties } =
    useLoaderData<CollaboratorsLoader>();

  const { user } = useRoot();

  const { getParam, handleChangeFilter } = useFilter("specialties");

  const { workspaceId } = useParams();

  const actionData = useActionData();
  const navigation = useNavigation();
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const activityAreaOptions: { label: string; value: string }[] =
    activityAreas.map((area) => ({
      label: area.name,
      value: area.id,
    }));

  const specialtyOptions: { label: string; value: string }[] = specialties.map(
    (specialty) => ({
      label: specialty.name,
      value: specialty.id,
    }),
  );

  return (
    <FormProvider
      form={<Form method="post" />}
      fieldErrors={actionData?.cause?.fieldErrors}
    >
      <ModalContainer isVisible={modalIsOpen} makeInvisible={closeModal}>
        <ModalHeader>Adicionar colaborador</ModalHeader>

        <ModalContent>
          <input type="hidden" name="organizationId" value={workspaceId} />
          <input type="hidden" name="invitedByUserId" value={user?.id} />
          <Input
            name="email"
            label="E-mail:"
            placeholder="Informe um e-mail válido"
            showAsterisk
          />

          <div className="borderRole">
            <RadioGroup
              name="roleId"
              label="Função"
              size="sm"
              value={selectedRoleId}
              onChange={(value) => {
                setSelectedRoleId(String(value));
              }}
            >
              {roles.map(({ description, id, name }) => (
                <RadioBox value={id} key={id}>
                  <div className="radioBoxContent">
                    <strong>{name}</strong>
                    <p>{description}</p>
                  </div>
                </RadioBox>
              ))}
            </RadioGroup>
          </div>

          <div className="registerProfessional">
            <div className="registerForm">
              <AvatarUploadArea name="avatar" action="/api/file-upload" />

              <div className="professionalFields">
                <Input
                  name="name"
                  label="Nome completo"
                  placeholder="Dr. João Silva"
                  showAsterisk
                />

                <Input
                  name="professionalRegistry"
                  label="Registro profissional"
                  placeholder="CRM 123456"
                  showAsterisk
                />

                <Select
                  name="activityAreaId"
                  label="Área de atuação"
                  placeholder="Selecione a área de atuação"
                  options={activityAreaOptions}
                  value={getParam("activityAreaId")}
                  onChange={(e) => handleChangeFilter("activityAreaId", e)}
                  showAsterisk
                />

                <Select
                  name="specialtyId"
                  label="Especialidade"
                  placeholder="Selecione a especialidade"
                  options={specialtyOptions}
                  showAsterisk
                />
              </div>
            </div>
          </div>
        </ModalContent>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={closeModal}>
            Cancelar
          </Button>
          <Button
            name="_action"
            value="createInviteCollaborator"
            isLoading={navigation.state !== "idle"}
            leftIcon={Check}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContainer>
    </FormProvider>
  );
}

export { CreateInviteCollaborator };
