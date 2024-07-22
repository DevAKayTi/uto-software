import { type NextPage } from "next";
import { FormProvider, useForm } from "react-hook-form";
import { Layout, MessagePrompt, Prompt } from "~/components";
import { CreateJournalForm } from "~/components/journal";
import {
  DEFAULT_JOURNAL,
  type JournalInput,
} from "../../../components/journal";
import { useCreateJournalMutation } from "~/data/main-accounting";
import { useEffect } from "react";
import { usePrompt } from "~/contexts";

const Journal: NextPage = () => {
  const { setPromptContent, setPromptTitle, showPrompt } = usePrompt();

  const methods = useForm<JournalInput>({
    defaultValues: {
      ...DEFAULT_JOURNAL,
    },
  });

  const {
    mutate: createMutateJournal,
    isLoading: loading,
    isError: mutateError,
    error: messageError,
  } = useCreateJournalMutation();

  useEffect(() => {
    if (mutateError) {
      setPromptTitle("Error");
      setPromptContent(<MessagePrompt message={messageError.message} />);
      showPrompt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutateError]);

  const onSubmit = (data: JournalInput) => {
    createMutateJournal({
      ...data,
      transactionItems: data.transactionItems.map((item) => {
        return {
          ...item,
          debit: item.debit !== null && !isNaN(item.debit) ? item.debit : null,
          credit:
            item.credit !== null && !isNaN(item.credit) ? item.credit : null,
        };
      }),
    });
  };

  const onhandelSubmit = () => {
    void methods.handleSubmit(onSubmit)();
  };

  return (
    <Layout title="New Journal">
      <FormProvider {...methods}>
        <CreateJournalForm
          onhandleSubmit={onhandelSubmit}
          isLoading={loading}
        />
      </FormProvider>
      <Prompt />
    </Layout>
  );
};

export default Journal;
