defmodule RemoteRetroWeb.VotingHandlers do
  alias RemoteRetro.{Repo, Vote}
  import Phoenix.Channel

  import ShorterMaps

  def handle_in("vote_submitted", ~m{idea_id, user_id}, socket) do
    reply_atom = insert_and_broadcast_to_other_clients(idea_id, user_id, socket)

    {:reply, reply_atom, socket}
  end

  defp insert_and_broadcast_to_other_clients(idea_id, user_id, socket) do
    try do
      insert_vote!(idea_id, user_id)
      broadcast_from! socket, "vote_submitted", ~m{idea_id, user_id}
      :ok
    rescue
      _ -> :error
    end
  end

  defp insert_vote!(idea_id, user_id) do
    %Vote{idea_id: idea_id, user_id: user_id}
    |> Vote.changeset
    |> Repo.insert!
  end
end
