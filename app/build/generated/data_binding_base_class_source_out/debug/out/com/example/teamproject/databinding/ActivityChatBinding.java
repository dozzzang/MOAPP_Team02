// Generated by view binder compiler. Do not edit!
package com.example.teamproject.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewbinding.ViewBinding;
import androidx.viewbinding.ViewBindings;
import com.example.teamproject.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ActivityChatBinding implements ViewBinding {
  @NonNull
  private final RelativeLayout rootView;

  @NonNull
  public final RelativeLayout bottomLayout;

  @NonNull
  public final ImageButton btnSend;

  @NonNull
  public final EditText etMsg;

  @NonNull
  public final RecyclerView recyclerView;

  @NonNull
  public final TextView tvWelcome;

  private ActivityChatBinding(@NonNull RelativeLayout rootView,
      @NonNull RelativeLayout bottomLayout, @NonNull ImageButton btnSend, @NonNull EditText etMsg,
      @NonNull RecyclerView recyclerView, @NonNull TextView tvWelcome) {
    this.rootView = rootView;
    this.bottomLayout = bottomLayout;
    this.btnSend = btnSend;
    this.etMsg = etMsg;
    this.recyclerView = recyclerView;
    this.tvWelcome = tvWelcome;
  }

  @Override
  @NonNull
  public RelativeLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static ActivityChatBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ActivityChatBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.activity_chat, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ActivityChatBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.bottom_layout;
      RelativeLayout bottomLayout = ViewBindings.findChildViewById(rootView, id);
      if (bottomLayout == null) {
        break missingId;
      }

      id = R.id.btn_send;
      ImageButton btnSend = ViewBindings.findChildViewById(rootView, id);
      if (btnSend == null) {
        break missingId;
      }

      id = R.id.et_msg;
      EditText etMsg = ViewBindings.findChildViewById(rootView, id);
      if (etMsg == null) {
        break missingId;
      }

      id = R.id.recycler_view;
      RecyclerView recyclerView = ViewBindings.findChildViewById(rootView, id);
      if (recyclerView == null) {
        break missingId;
      }

      id = R.id.tv_welcome;
      TextView tvWelcome = ViewBindings.findChildViewById(rootView, id);
      if (tvWelcome == null) {
        break missingId;
      }

      return new ActivityChatBinding((RelativeLayout) rootView, bottomLayout, btnSend, etMsg,
          recyclerView, tvWelcome);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}