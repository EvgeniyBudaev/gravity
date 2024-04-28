import type { FC } from "react";
import { Field } from "@/app/shared/components/form/field";
import { Header } from "@/app/shared/components/header";
import { Section } from "@/app/shared/components/section";
import { Skeleton } from "@/app/uikit/components/skeleton";
import "./ProfileSkeletonForm.scss";

export const ProfileSkeletonForm: FC = () => {
  return (
    <>
      <Header>
        <Skeleton height="100%" width="100%" />
      </Header>
      <Section title={<Skeleton height="18px" width="160px" />}>
        <Field>
          <Skeleton height="80px" width="80px" />
        </Field>
      </Section>
      <Section title={<Skeleton height="18px" width="160px" />}>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="100px" width="100%" />
        </Field>
      </Section>
      <Section title={<Skeleton height="18px" width="160px" />}>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
        <Field>
          <Skeleton height="35px" width="100%" />
        </Field>
      </Section>
    </>
  );
};
