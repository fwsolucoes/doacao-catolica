import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useRouteError } from "react-router";

import bulletBoxSvg from "~/client/assets/bullet-box.svg";
import whatsappLogoSvg from "~/client/assets/whatsapp-logo.svg";
import { Button } from "~/client/components/ui/button";
import { useRoot } from "~/client/hooks/useRoot";
import { Container } from "./styles";

type ErrorProps = {
  name: string;
  message: string | null;
  fieldErrors?: Record<string, string> | null;
};

function ErrorBoundaryPage() {
  const routeError = useRouteError() as any;

  const errorStatus: number = routeError?.status || 500;
  const errorCause: string = routeError?.cause || "Unknown Cause";
  const errorData: ErrorProps = routeError?.body || "Unknown Error";

  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  const location = useLocation();
  const { environmentVariables } = useRoot();

  function openWhatsappWithError() {
    const jsonString = JSON.stringify(errorData);
    const errorMessage = `Projeto: Sancton\nURL: ${location.pathname}\nStatus: ${errorStatus}\nCausa: ${errorCause}\nNome: ${errorData.name}\nMensagem: ${errorData.message || "N/A"}\nErros: ${jsonString}`;

    const whatsappUrl = `https://wa.me/${environmentVariables.WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(
      `Olá, estou enfrentando um problema com o sistema. Aqui estão os detalhes do erro:\n\n${errorMessage}`,
    )}`;

    window.open(whatsappUrl, "_blank");
  }

  return (
    <Container>
      <strong className="status">{errorStatus}</strong>
      <strong className="title">Ops! Tivemos um problema</strong>

      <img src={bulletBoxSvg} alt="Bullet Box" className="bulletBox first" />
      <img src={bulletBoxSvg} alt="Bullet Box" className="bulletBox second" />

      <p>
        Desculpe, encontramos alguns problemas técnicos durante a sua última
        operação.
      </p>

      <p>
        Por favor, tente novamente mais tarde ou entre em contato com o suporte
        caso o problema persista.
      </p>

      <div className="buttonGroup">
        <Button variant="outline" size="lg" onClick={handleGoBack}>
          <ArrowLeft size={20} />
          Voltar
        </Button>
        <Button size="lg" onClick={openWhatsappWithError}>
          <img src={whatsappLogoSvg} width={20} height={20} alt="" />
          Falar com o suporte
        </Button>
      </div>
    </Container>
  );
}

export { ErrorBoundaryPage };
