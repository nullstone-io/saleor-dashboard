// @ts-strict-ignore
import { useGiftCardList } from "@dashboard/giftCards/GiftCardsList/providers/GiftCardListProvider";
import {
  BulkDeleteGiftCardMutation,
  useBulkDeleteGiftCardMutation,
} from "@dashboard/graphql";
import { MutationResultWithOpts } from "@dashboard/hooks/makeMutation";
import useNotifier from "@dashboard/hooks/useNotifier";
import commonErrorMessages from "@dashboard/utils/errors/common";
import { useIntl } from "react-intl";

import { giftCardDeleteDialogMessages as messages } from "./messages";

interface UseGiftCardBulkDeleteProps {
  onBulkDeleteGiftCards: () => void;
  bulkDeleteGiftCardOpts: MutationResultWithOpts<BulkDeleteGiftCardMutation>;
}

const useGiftCardBulkDelete = ({
  onClose,
  refetchQueries,
}: {
  onClose: () => void;
  refetchQueries?: string[];
}): UseGiftCardBulkDeleteProps => {
  const notify = useNotifier();
  const intl = useIntl();

  const {
    listElements,
    selectedItemsCount,
    reset: resetSelectedItems,
  } = useGiftCardList();

  const [bulkDeleteGiftCard, bulkDeleteGiftCardOpts] =
    useBulkDeleteGiftCardMutation({
      onCompleted: data => {
        const errors = data?.giftCardBulkDelete?.errors;

        if (!errors.length) {
          notify({
            status: "success",
            text: intl.formatMessage(messages.deleteSuccessAlertText, {
              selectedItemsCount,
            }),
          });

          onClose();
          resetSelectedItems();
          return;
        }

        notify({
          status: "error",
          text: intl.formatMessage(commonErrorMessages.unknownError),
        });
      },
      refetchQueries,
    });

  const onBulkDeleteGiftCards = () =>
    bulkDeleteGiftCard({ variables: { ids: listElements } });

  return {
    onBulkDeleteGiftCards,
    bulkDeleteGiftCardOpts,
  };
};

export default useGiftCardBulkDelete;
