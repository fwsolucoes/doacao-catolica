import {
  ArrowLeft,
  HeartHandshake,
  Home,
  MessageCircle,
  RefreshCw,
} from "lucide-react";
import { useLocation, useNavigate, useRouteError } from "react-router";

import bulletBoxSvg from "~/client/assets/bullet-box.svg";
import whatsappLogoSvg from "~/client/assets/whatsapp-logo.svg";
import { Button } from "~/client/components/ui/button";
import { Card } from "~/client/components/ui/card";
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

  function buildSupportWhatsappUrl() {
    const jsonString = JSON.stringify(errorData);
    const errorMessage = `Projeto: Sancton\nURL: ${location.pathname}\nStatus: ${errorStatus}\nCausa: ${errorCause}\nNome: ${errorData.name}\nMensagem: ${errorData.message || "N/A"}\nErros: ${jsonString}`;

    return `https://wa.me/${environmentVariables.WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(
      `Olá, estou enfrentando um problema com o sistema. Aqui estão os detalhes do erro:\n\n${errorMessage}`,
    )}`;
  }

  function openWhatsappWithError() {
    window.open(buildSupportWhatsappUrl(), "_blank");
  }

  if (errorStatus >= 500) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-6">
        <Card.Root className="max-w-xl items-center gap-6 rounded-2xl p-12 text-center">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
            <HeartHandshake className="size-11" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Houve uma instabilidade na conexão
            </h1>
            <p className="text-base leading-6 text-muted-foreground">
              Pode ser uma falha momentânea na sua internet. Verifique sua
              conexão e tente novamente — seus dados estão seguros.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()}>
              <RefreshCw size={16} />
              Tentar novamente
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/my-campaigns")}
            >
              <Home size={16} />
              Voltar ao início
            </Button>
          </div>
          <p className="text-base text-muted-foreground">
            Se continuar acontecendo,{" "}
            <a
              href={buildSupportWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 align-middle text-primary underline underline-offset-4"
            >
              <MessageCircle size={16} />
              fale com nosso suporte
            </a>
            .
          </p>
        </Card.Root>
      </div>
    );
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
