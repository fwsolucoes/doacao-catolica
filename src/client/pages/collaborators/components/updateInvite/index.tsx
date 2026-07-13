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
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { AvatarUploadArea } from "~/client/components/avatarUploadArea";
import type { CollaboratorsLoader } from "~/client/types/collaboratorsLoader";
import { ModalContent } from "./styles";

type UpdateCollaboratorModalData = {
  id?: string;
  email?: string;
  roleId?: string;
  name?: string;
  avatar?: string | null;
  professionalRegistry?: string;
  activityAreaId?: string;
  specialtyId?: string;
};

function UpdateInvite() {
  const { modalIsOpen, modalData, closeModal } = useModal("update-invite");
  const { roles, activityAreas, specialties } =
    useLoaderData<CollaboratorsLoader>();

  const actionData = useActionData();
  const navigation = useNavigation();

  const typedModalData = (modalData ?? {}) as UpdateCollaboratorModalData;

  const [selectedRoleId, setSelectedRoleId] = useState(
    typedModalData.roleId ?? "",
  );
  const [selectedActivityAreaId, setSelectedActivityAreaId] = useState("");

  useEffect(() => {
    if (!modalIsOpen) return;

    const initialRoleId = typedModalData.roleId ?? "";

    const specialtyActivityAreaId = specialties.find(
      (specialty) => specialty.id === typedModalData.specialtyId,
    )?.activityAreaId;

    const initialActivityAreaId =
      typedModalData.activityAreaId ?? specialtyActivityAreaId ?? "";

    setSelectedRoleId(initialRoleId);
    setSelectedActivityAreaId(initialActivityAreaId);
  }, [
    modalIsOpen,
    specialties,
    typedModalData.roleId,
    typedModalData.specialtyId,
    typedModalData.activityAreaId,
  ]);

  const activityAreaOptions: { label: string; value: string }[] =
    activityAreas.map((area) => ({
      label: area.name,
      value: area.id,
    }));

  const specialtyOptions: { label: string; value: string }[] = useMemo(() => {
    const filteredSpecialties = selectedActivityAreaId
      ? specialties.filter(
          (specialty) => specialty.activityAreaId === selectedActivityAreaId,
        )
      : specialties;

    return filteredSpecialties.map((specialty) => ({
      label: specialty.name,
      value: specialty.id,
    }));
  }, [selectedActivityAreaId, specialties]);

  return (
    <FormProvider
      form={<Form method="post" />}
      fieldErrors={actionData?.cause?.fieldErrors}
    >
      <ModalContainer isVisible={modalIsOpen} makeInvisible={closeModal}>
        <ModalHeader>Atualizar colaborador</ModalHeader>

        <ModalContent>
          <input type="hidden" name="id" value={typedModalData.id ?? ""} />

          <Input
            name="email"
            label="E-mail:"
            placeholder="Informe um e-mail válido"
            defaultValue={typedModalData.email ?? ""}
            showAsterisk
          />

          <div className="borderRole">
            <RadioGroup
              name="roleId"
              label="Função"
              size="sm"
              value={selectedRoleId}
              onChange={(value) => {
                const nextRoleId = String(value);
                setSelectedRoleId(nextRoleId);
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
              <AvatarUploadArea
                name="avatar"
                action="/api/file-upload"
                defaultValue={typedModalData.avatar}
              />

              <div className="professionalFields">
                <Input
                  name="name"
                  label="Nome completo"
                  placeholder="Dr. João Silva"
                  defaultValue={typedModalData.name ?? ""}
                  showAsterisk
                />

                <Input
                  name="professionalRegistry"
                  label="Registro profissional"
                  placeholder="CRM 123456"
                  defaultValue={typedModalData.professionalRegistry ?? ""}
                  showAsterisk
                />

                <Select
                  name="activityAreaId"
                  label="Área de atuação"
                  placeholder="Selecione a área de atuação"
                  options={activityAreaOptions}
                  value={selectedActivityAreaId}
                  onChange={(value) => {
                    const nextValue = String(value);
                    setSelectedActivityAreaId(nextValue);
                  }}
                  showAsterisk
                />

                <Select
                  name="specialtyId"
                  label="Especialidade"
                  placeholder="Selecione a especialidade"
                  options={specialtyOptions}
                  defaultValue={typedModalData.specialtyId ?? ""}
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
            value="updateInvite"
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

export { UpdateInvite };
