import autogen


class AIConfiguration:
    model_config = autogen.config_list_from_dotenv(
        dotenv_file_path=".env",
        model_api_key_map={"gpt-4o-mini": "OPENAI_API_KEY"},
        filter_dict={
            "model": {
                "gpt-4o-mini",
            }
        }
    )

    learning_generator_llm_config = {
        "timeout": 600,
        "cache_seed": 11,
        "config_list": model_config,
        "temperature": 0,
    }

    formatter_llm_config = {
        "timeout": 600,
        # "cache_seed": 33,
        "config_list": model_config,
        "temperature": 0,
    }

    developer_llm_config = {
        "timeout": 600,
        "cache_seed": 33,
        "config_list": model_config,
        "temperature": 0,
    }

