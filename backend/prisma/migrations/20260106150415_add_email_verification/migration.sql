-- AlterTable
ALTER TABLE "public"."utilisateur" ADD COLUMN     "email_verified_at" TIMESTAMPTZ(6),
ADD COLUMN     "email_verify_expires_at" TIMESTAMPTZ(6),
ADD COLUMN     "email_verify_token_hash" TEXT;
