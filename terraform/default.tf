terraform {
  required_providers {
    yandex = {
      source = "yandex-cloud/yandex"
    }
  }
  required_version = ">= 0.13"
}

locals {
  folder_id = "b1g9jjr2hgj4cqau18r6"
  cloud_id  = "bpffnq4elh6kbbqn4k2n"
}

provider "yandex" {
  zone                     = "ru-central1-d"
  cloud_id                 = local.cloud_id
  folder_id                = local.folder_id
  service_account_key_file = "D:/ITMO/Devops/authorized_key.json"
}