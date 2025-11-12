"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../common";
import { Button } from "../common";
import { intentsService } from "../../services";

interface IntentFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface IntentFormProps {
  onSuccess?: () => void;
}

export function IntentForm({ onSuccess }: IntentFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IntentFormData>();

  const onSubmit = async (data: IntentFormData) => {
    setLoading(true);
    setError(null);

    try {
      await intentsService.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        source: "website",
      });

      setSuccess(true);
      reset();

      if (onSuccess) {
        onSuccess();
      }

      // Remove mensagem de sucesso após 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erro ao enviar formulário. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ Formulário enviado com sucesso!
          </p>
          <p className="text-green-600 text-sm mt-1">
            Entraremos em contato em breve.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">✗ {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nome completo"
          placeholder="Seu nome"
          {...register("name", {
            required: "Nome é obrigatório",
            minLength: {
              value: 3,
              message: "Nome deve ter no mínimo 3 caracteres",
            },
          })}
          error={errors.name?.message}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          {...register("email", {
            required: "E-mail é obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "E-mail inválido",
            },
          })}
          error={errors.email?.message}
        />

        <Input
          label="Telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          {...register("phone", {
            required: "Telefone é obrigatório",
            pattern: {
              value: /^[\d\s()+-]+$/,
              message: "Telefone inválido",
            },
          })}
          error={errors.phone?.message}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem
          </label>
          <textarea
            placeholder="Por que você gostaria de participar do grupo?"
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            {...register("message", {
              required: "Mensagem é obrigatória",
              minLength: {
                value: 10,
                message: "Mensagem deve ter no mínimo 10 caracteres",
              },
            })}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Enviar Solicitação
        </Button>
      </form>
    </div>
  );
}
